import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertEventSchema, 
  insertTicketSchema,
  insertHarambeeSchema,
  insertContributionSchema,
  insertRentalSchema,
  insertAlertSchema,
  insertCommentSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { randomBytes } from "crypto";
import { authenticateToken } from "./middleware/auth";

// Helper function to handle zod validation errors
function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new Error(validationError.message);
    }
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Apply authentication middleware to all routes
  app.use(authenticateToken);

  // User Authentication Routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = validateData(insertUserSchema, req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // In real app, would hash password here
      const newUser = await storage.createUser(userData);
      
      // Omit password when returning user data
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });
  
  // Event Routes
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const events = await storage.getEvents(limit, offset);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  
  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  app.post("/api/events", async (req: Request, res: Response) => {
    try {
      const eventData = validateData(insertEventSchema, req.body);
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid event data" });
    }
  });
  
  // Ticket Routes
  app.post("/api/tickets", async (req: Request, res: Response) => {
    try {
      const ticketData = validateData(insertTicketSchema, req.body);
      
      // Generate QR code (in a real app this would be more sophisticated)
      const qrCode = randomBytes(16).toString('hex');
      
      const newTicket = await storage.createTicket({
        ...ticketData,
        qrCode
      });
      
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid ticket data" });
    }
  });
  
  app.get("/api/tickets/event/:eventId", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const tickets = await storage.getTicketsByEvent(eventId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });
  
  app.get("/api/tickets/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const tickets = await storage.getTicketsByUser(userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });
  
  // Harambee Routes
  app.get("/api/harambees", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const harambees = await storage.getHarambees(limit, offset);
      res.json(harambees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch harambees" });
    }
  });
  
  app.get("/api/harambees/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const harambee = await storage.getHarambee(id);
      
      if (!harambee) {
        return res.status(404).json({ message: "Harambee not found" });
      }
      
      res.json(harambee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch harambee" });
    }
  });
  
  app.post("/api/harambees", async (req: Request, res: Response) => {
    try {
      const harambeeData = validateData(insertHarambeeSchema, req.body);
      const newHarambee = await storage.createHarambee(harambeeData);
      res.status(201).json(newHarambee);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid harambee data" });
    }
  });
  
  // Contribution Routes
  app.post("/api/contributions", async (req: Request, res: Response) => {
    try {
      const contributionData = validateData(insertContributionSchema, req.body);
      
      // Verify harambee exists
      const harambee = await storage.getHarambee(contributionData.harambeeId);
      if (!harambee) {
        return res.status(404).json({ message: "Harambee not found" });
      }
      
      const newContribution = await storage.createContribution(contributionData);
      
      // Get updated harambee
      const updatedHarambee = await storage.getHarambee(contributionData.harambeeId);
      
      res.status(201).json({ 
        contribution: newContribution,
        harambee: updatedHarambee
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid contribution data" });
    }
  });
  
  // Rental Routes
  app.get("/api/rentals", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const rentals = await storage.getRentals(category, limit, offset);
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rentals" });
    }
  });
  
  app.get("/api/rentals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const rental = await storage.getRental(id);
      
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      res.json(rental);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental" });
    }
  });
  
  app.post("/api/rentals", async (req: Request, res: Response) => {
    try {
      const rentalData = validateData(insertRentalSchema, req.body);
      const newRental = await storage.createRental(rentalData);
      res.status(201).json(newRental);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid rental data" });
    }
  });
  
  // Alert Routes
  app.get("/api/alerts", async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const alerts = await storage.getAlerts(type, limit, offset);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });
  
  app.get("/api/alerts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.getAlert(id);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });
  
  app.post("/api/alerts", async (req: Request, res: Response) => {
    try {
      const alertData = validateData(insertAlertSchema, req.body);
      const newAlert = await storage.createAlert(alertData);
      res.status(201).json(newAlert);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid alert data" });
    }
  });
  
  // Comment Routes
  app.get("/api/alerts/:alertId/comments", async (req: Request, res: Response) => {
    try {
      const alertId = parseInt(req.params.alertId);
      
      // Verify alert exists
      const alert = await storage.getAlert(alertId);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      const comments = await storage.getCommentsByAlert(alertId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  
  app.post("/api/comments", async (req: Request, res: Response) => {
    try {
      const commentData = validateData(insertCommentSchema, req.body);
      
      // Verify alert exists
      const alert = await storage.getAlert(commentData.alertId);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      const newComment = await storage.createComment(commentData);
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid comment data" });
    }
  });

  return httpServer;
}
