import {
  users,
  events,
  tickets,
  harambees,
  contributions,
  rentals,
  alerts,
  comments,
  type User,
  type Event,
  type Ticket,
  type Harambee,
  type Contribution,
  type Rental,
  type Alert,
  type Comment,
  type InsertUser,
  type InsertEvent,
  type InsertTicket,
  type InsertHarambee,
  type InsertContribution,
  type InsertRental,
  type InsertAlert,
  type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: number, verified: boolean): Promise<User | undefined>;

  // Event operations
  getEvents(limit?: number, offset?: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Ticket operations
  getTicketsByEvent(eventId: number): Promise<Ticket[]>;
  getTicketsByUser(userId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  
  // Harambee operations
  getHarambees(limit?: number, offset?: number): Promise<Harambee[]>;
  getHarambee(id: number): Promise<Harambee | undefined>;
  createHarambee(harambee: InsertHarambee): Promise<Harambee>;
  updateHarambeeAmount(id: number, amount: number): Promise<Harambee | undefined>;
  
  // Contribution operations
  getContributionsByHarambee(harambeeId: number): Promise<Contribution[]>;
  getContributionsByUser(userId: number): Promise<Contribution[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  
  // Rental operations
  getRentals(category?: string, limit?: number, offset?: number): Promise<Rental[]>;
  getRental(id: number): Promise<Rental | undefined>;
  createRental(rental: InsertRental): Promise<Rental>;
  
  // Alert operations
  getAlerts(type?: string, limit?: number, offset?: number): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  // Comment operations
  getCommentsByAlert(alertId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private tickets: Map<number, Ticket>;
  private harambees: Map<number, Harambee>;
  private contributions: Map<number, Contribution>;
  private rentals: Map<number, Rental>;
  private alerts: Map<number, Alert>;
  private comments: Map<number, Comment>;
  
  private userIdCounter = 1;
  private eventIdCounter = 1;
  private ticketIdCounter = 1;
  private harambeeIdCounter = 1;
  private contributionIdCounter = 1;
  private rentalIdCounter = 1;
  private alertIdCounter = 1;
  private commentIdCounter = 1;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.tickets = new Map();
    this.harambees = new Map();
    this.contributions = new Map();
    this.rentals = new Map();
    this.alerts = new Map();
    this.comments = new Map();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      verified: false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserVerification(id: number, verified: boolean): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, verified };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event operations
  async getEvents(limit = 10, offset = 0): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: Event = {
      ...insertEvent,
      id,
      createdAt: now
    };
    this.events.set(id, event);
    return event;
  }

  // Ticket operations
  async getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.eventId === eventId
    );
  }

  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.userId === userId
    );
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const now = new Date();
    const ticket: Ticket = {
      ...insertTicket,
      id,
      used: false,
      purchasedAt: now
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  // Harambee operations
  async getHarambees(limit = 10, offset = 0): Promise<Harambee[]> {
    return Array.from(this.harambees.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getHarambee(id: number): Promise<Harambee | undefined> {
    return this.harambees.get(id);
  }

  async createHarambee(insertHarambee: InsertHarambee): Promise<Harambee> {
    const id = this.harambeeIdCounter++;
    const now = new Date();
    const harambee: Harambee = {
      ...insertHarambee,
      id,
      raisedAmount: 0,
      createdAt: now
    };
    this.harambees.set(id, harambee);
    return harambee;
  }

  async updateHarambeeAmount(id: number, amount: number): Promise<Harambee | undefined> {
    const harambee = await this.getHarambee(id);
    if (!harambee) return undefined;
    
    const updatedHarambee = { 
      ...harambee, 
      raisedAmount: harambee.raisedAmount + amount 
    };
    this.harambees.set(id, updatedHarambee);
    return updatedHarambee;
  }

  // Contribution operations
  async getContributionsByHarambee(harambeeId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.harambeeId === harambeeId
    );
  }

  async getContributionsByUser(userId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.userId === userId
    );
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = this.contributionIdCounter++;
    const now = new Date();
    const contribution: Contribution = {
      ...insertContribution,
      id,
      contributedAt: now
    };
    this.contributions.set(id, contribution);
    
    // Update harambee amount
    await this.updateHarambeeAmount(
      insertContribution.harambeeId, 
      insertContribution.amount
    );
    
    return contribution;
  }

  // Rental operations
  async getRentals(category?: string, limit = 10, offset = 0): Promise<Rental[]> {
    let rentals = Array.from(this.rentals.values());
    
    if (category && category !== 'All') {
      rentals = rentals.filter(rental => rental.category === category);
    }
    
    return rentals
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getRental(id: number): Promise<Rental | undefined> {
    return this.rentals.get(id);
  }

  async createRental(insertRental: InsertRental): Promise<Rental> {
    const id = this.rentalIdCounter++;
    const now = new Date();
    const rental: Rental = {
      ...insertRental,
      id,
      createdAt: now
    };
    this.rentals.set(id, rental);
    return rental;
  }

  // Alert operations
  async getAlerts(type?: string, limit = 10, offset = 0): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    
    if (type && type !== 'All') {
      alerts = alerts.filter(alert => alert.type === type);
    }
    
    return alerts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertIdCounter++;
    const now = new Date();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: now
    };
    this.alerts.set(id, alert);
    return alert;
  }

  // Comment operations
  async getCommentsByAlert(alertId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.alertId === alertId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: now
    };
    this.comments.set(id, comment);
    return comment;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserVerification(id: number, verified: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ verified })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Event operations
  async getEvents(limit = 10, offset = 0): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  // Ticket operations
  async getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.eventId, eventId));
  }

  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.userId, userId));
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const [ticket] = await db.insert(tickets).values(insertTicket).returning();
    return ticket;
  }

  // Harambee operations
  async getHarambees(limit = 10, offset = 0): Promise<Harambee[]> {
    return await db
      .select()
      .from(harambees)
      .orderBy(desc(harambees.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getHarambee(id: number): Promise<Harambee | undefined> {
    const [harambee] = await db.select().from(harambees).where(eq(harambees.id, id));
    return harambee;
  }

  async createHarambee(insertHarambee: InsertHarambee): Promise<Harambee> {
    const harambeeWithRaisedAmount = {
      ...insertHarambee,
      raisedAmount: 0
    };
    const [harambee] = await db.insert(harambees).values(harambeeWithRaisedAmount).returning();
    return harambee;
  }

  async updateHarambeeAmount(id: number, amount: number): Promise<Harambee | undefined> {
    const harambee = await this.getHarambee(id);
    if (!harambee) return undefined;
    
    const newAmount = (harambee.raisedAmount || 0) + amount;
    
    const [updatedHarambee] = await db
      .update(harambees)
      .set({ raisedAmount: newAmount })
      .where(eq(harambees.id, id))
      .returning();
    
    return updatedHarambee;
  }

  // Contribution operations
  async getContributionsByHarambee(harambeeId: number): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.harambeeId, harambeeId));
  }

  async getContributionsByUser(userId: number): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.userId, userId));
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const [contribution] = await db.insert(contributions).values(insertContribution).returning();
    
    // Update harambee amount
    await this.updateHarambeeAmount(
      insertContribution.harambeeId, 
      insertContribution.amount
    );
    
    return contribution;
  }

  // Rental operations
  async getRentals(category?: string, limit = 10, offset = 0): Promise<Rental[]> {
    if (category && category !== 'All') {
      return await db
        .select()
        .from(rentals)
        .where(eq(rentals.category, category))
        .orderBy(desc(rentals.createdAt))
        .limit(limit)
        .offset(offset);
    }
    
    return await db
      .select()
      .from(rentals)
      .orderBy(desc(rentals.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getRental(id: number): Promise<Rental | undefined> {
    const [rental] = await db.select().from(rentals).where(eq(rentals.id, id));
    return rental;
  }

  async createRental(insertRental: InsertRental): Promise<Rental> {
    const [rental] = await db.insert(rentals).values(insertRental).returning();
    return rental;
  }

  // Alert operations
  async getAlerts(type?: string, limit = 10, offset = 0): Promise<Alert[]> {
    if (type && type !== 'All') {
      return await db
        .select()
        .from(alerts)
        .where(eq(alerts.type, type))
        .orderBy(desc(alerts.createdAt))
        .limit(limit)
        .offset(offset);
    }
    
    return await db
      .select()
      .from(alerts)
      .orderBy(desc(alerts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }

  // Comment operations
  async getCommentsByAlert(alertId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.alertId, alertId))
      .orderBy(comments.createdAt);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }
}

export const storage = new DatabaseStorage();
