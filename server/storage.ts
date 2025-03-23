import { 
  users, type User, type InsertUser,
  members, type Member, type InsertMember,
  membershipPlans, type MembershipPlan, type InsertMembershipPlan,
  subscriptions, type Subscription, type InsertSubscription,
  payments, type Payment, type InsertPayment,
  attendance, type Attendance, type InsertAttendance,
  equipment, type Equipment, type InsertEquipment,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Member methods
  getMember(id: number): Promise<Member | undefined>;
  getMembers(): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined>;
  
  // Membership Plan methods
  getMembershipPlan(id: number): Promise<MembershipPlan | undefined>;
  getMembershipPlans(): Promise<MembershipPlan[]>;
  createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan>;
  updateMembershipPlan(id: number, plan: Partial<InsertMembershipPlan>): Promise<MembershipPlan | undefined>;
  
  // Subscription methods
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptions(): Promise<Subscription[]>;
  getMemberSubscriptions(memberId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  
  // Payment methods
  getPayment(id: number): Promise<Payment | undefined>;
  getPayments(): Promise<Payment[]>;
  getMemberPayments(memberId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Attendance methods
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceRecords(): Promise<Attendance[]>;
  getMemberAttendance(memberId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<Attendance>): Promise<Attendance | undefined>;
  
  // Equipment methods
  getEquipment(id: number): Promise<Equipment | undefined>;
  getAllEquipment(): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  
  // Activity Log methods
  getActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  // Storage collections
  private usersData: Map<number, User>;
  private membersData: Map<number, Member>;
  private membershipPlansData: Map<number, MembershipPlan>;
  private subscriptionsData: Map<number, Subscription>;
  private paymentsData: Map<number, Payment>;
  private attendanceData: Map<number, Attendance>;
  private equipmentData: Map<number, Equipment>;
  private activityLogsData: Map<number, ActivityLog>;
  
  // IDs counters
  private userIdCounter: number;
  private memberIdCounter: number;
  private planIdCounter: number;
  private subscriptionIdCounter: number;
  private paymentIdCounter: number;
  private attendanceIdCounter: number;
  private equipmentIdCounter: number;
  private activityLogIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.usersData = new Map();
    this.membersData = new Map();
    this.membershipPlansData = new Map();
    this.subscriptionsData = new Map();
    this.paymentsData = new Map();
    this.attendanceData = new Map();
    this.equipmentData = new Map();
    this.activityLogsData = new Map();
    
    this.userIdCounter = 1;
    this.memberIdCounter = 1;
    this.planIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.paymentIdCounter = 1;
    this.attendanceIdCounter = 1;
    this.equipmentIdCounter = 1;
    this.activityLogIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some default plans
    this.createMembershipPlan({
      name: "Standard Monthly",
      description: "Basic gym access with standard equipment",
      duration: 30,
      price: "49.99",
      active: true
    });
    
    this.createMembershipPlan({
      name: "Premium Monthly",
      description: "Full access to all gym facilities and classes",
      duration: 30,
      price: "89.99",
      active: true
    });
    
    this.createMembershipPlan({
      name: "Standard Annual",
      description: "Basic gym access with standard equipment with annual discount",
      duration: 365,
      price: "499.99",
      active: true
    });
    
    this.createMembershipPlan({
      name: "Elite Quarterly",
      description: "Complete access to all facilities with personal trainer sessions",
      duration: 90,
      price: "249.99",
      active: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.usersData.set(id, newUser);
    return newUser;
  }
  
  // Member methods
  async getMember(id: number): Promise<Member | undefined> {
    return this.membersData.get(id);
  }
  
  async getMembers(): Promise<Member[]> {
    return Array.from(this.membersData.values());
  }
  
  async createMember(member: InsertMember): Promise<Member> {
    const id = this.memberIdCounter++;
    const newMember: Member = { ...member, id, createdAt: new Date() };
    this.membersData.set(id, newMember);
    
    // Log activity
    this.createActivityLog({
      action: "member_added",
      description: `New member added: ${member.fullName}`,
      entityId: id,
      entityType: "members"
    });
    
    return newMember;
  }
  
  async updateMember(id: number, memberUpdate: Partial<InsertMember>): Promise<Member | undefined> {
    const existingMember = this.membersData.get(id);
    if (!existingMember) return undefined;
    
    const updatedMember = { ...existingMember, ...memberUpdate };
    this.membersData.set(id, updatedMember);
    
    // Log activity
    this.createActivityLog({
      action: "member_updated",
      description: `Member updated: ${updatedMember.fullName}`,
      entityId: id,
      entityType: "members"
    });
    
    return updatedMember;
  }
  
  // Membership Plan methods
  async getMembershipPlan(id: number): Promise<MembershipPlan | undefined> {
    return this.membershipPlansData.get(id);
  }
  
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    return Array.from(this.membershipPlansData.values());
  }
  
  async createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan> {
    const id = this.planIdCounter++;
    const newPlan: MembershipPlan = { ...plan, id, createdAt: new Date() };
    this.membershipPlansData.set(id, newPlan);
    
    // Log activity
    this.createActivityLog({
      action: "plan_added",
      description: `New membership plan added: ${plan.name}`,
      entityId: id,
      entityType: "membership_plans"
    });
    
    return newPlan;
  }
  
  async updateMembershipPlan(id: number, planUpdate: Partial<InsertMembershipPlan>): Promise<MembershipPlan | undefined> {
    const existingPlan = this.membershipPlansData.get(id);
    if (!existingPlan) return undefined;
    
    const updatedPlan = { ...existingPlan, ...planUpdate };
    this.membershipPlansData.set(id, updatedPlan);
    
    // Log activity
    this.createActivityLog({
      action: "plan_updated",
      description: `Membership plan updated: ${updatedPlan.name}`,
      entityId: id,
      entityType: "membership_plans"
    });
    
    return updatedPlan;
  }
  
  // Subscription methods
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptionsData.get(id);
  }
  
  async getSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptionsData.values());
  }
  
  async getMemberSubscriptions(memberId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptionsData.values())
      .filter(subscription => subscription.memberId === memberId);
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionIdCounter++;
    const newSubscription: Subscription = { ...subscription, id, createdAt: new Date() };
    this.subscriptionsData.set(id, newSubscription);
    
    // Log activity
    const member = await this.getMember(subscription.memberId);
    const plan = await this.getMembershipPlan(subscription.planId);
    this.createActivityLog({
      action: "subscription_added",
      description: `New subscription added for ${member?.fullName || 'Unknown'}: ${plan?.name || 'Unknown'}`,
      entityId: id,
      entityType: "subscriptions"
    });
    
    return newSubscription;
  }
  
  async updateSubscription(id: number, subscriptionUpdate: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const existingSubscription = this.subscriptionsData.get(id);
    if (!existingSubscription) return undefined;
    
    const updatedSubscription = { ...existingSubscription, ...subscriptionUpdate };
    this.subscriptionsData.set(id, updatedSubscription);
    
    // Log activity
    this.createActivityLog({
      action: "subscription_updated",
      description: `Subscription updated: ID ${id}`,
      entityId: id,
      entityType: "subscriptions"
    });
    
    return updatedSubscription;
  }
  
  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.paymentsData.get(id);
  }
  
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.paymentsData.values());
  }
  
  async getMemberPayments(memberId: number): Promise<Payment[]> {
    return Array.from(this.paymentsData.values())
      .filter(payment => payment.memberId === memberId);
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const newPayment: Payment = { ...payment, id, createdAt: new Date() };
    this.paymentsData.set(id, newPayment);
    
    // Log activity
    const member = await this.getMember(payment.memberId);
    this.createActivityLog({
      action: "payment_received",
      description: `Payment received from ${member?.fullName || 'Unknown'}: $${payment.amount}`,
      entityId: id,
      entityType: "payments"
    });
    
    return newPayment;
  }
  
  // Attendance methods
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendanceData.get(id);
  }
  
  async getAttendanceRecords(): Promise<Attendance[]> {
    return Array.from(this.attendanceData.values());
  }
  
  async getMemberAttendance(memberId: number): Promise<Attendance[]> {
    return Array.from(this.attendanceData.values())
      .filter(record => record.memberId === memberId);
  }
  
  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceIdCounter++;
    const newAttendance: Attendance = { 
      ...attendance, 
      id, 
      checkOutTime: null, 
      createdAt: new Date() 
    };
    this.attendanceData.set(id, newAttendance);
    
    // Log activity
    const member = await this.getMember(attendance.memberId);
    this.createActivityLog({
      action: "check_in",
      description: `${member?.fullName || 'Unknown'} checked in`,
      entityId: id,
      entityType: "attendance"
    });
    
    return newAttendance;
  }
  
  async updateAttendance(id: number, attendanceUpdate: Partial<Attendance> | { checkOutTime: string }): Promise<Attendance | undefined> {
    const existingAttendance = this.attendanceData.get(id);
    if (!existingAttendance) return undefined;
    
    // Handle the string to Date conversion for checkOutTime
    let finalUpdate: Partial<Attendance> = { ...attendanceUpdate };
    if ('checkOutTime' in attendanceUpdate && typeof attendanceUpdate.checkOutTime === 'string') {
      finalUpdate = {
        ...attendanceUpdate,
        checkOutTime: new Date(attendanceUpdate.checkOutTime)
      };
    }
    
    const updatedAttendance = { ...existingAttendance, ...finalUpdate };
    this.attendanceData.set(id, updatedAttendance);
    
    // Log check-out if that's what's being updated
    if (finalUpdate.checkOutTime && !existingAttendance.checkOutTime) {
      const member = await this.getMember(existingAttendance.memberId);
      this.createActivityLog({
        action: "check_out",
        description: `${member?.fullName || 'Unknown'} checked out`,
        entityId: id,
        entityType: "attendance"
      });
    }
    
    return updatedAttendance;
  }
  
  // Equipment methods
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipmentData.get(id);
  }
  
  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipmentData.values());
  }
  
  async createEquipment(equipment: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentIdCounter++;
    const newEquipment: Equipment = { ...equipment, id, createdAt: new Date() };
    this.equipmentData.set(id, newEquipment);
    
    // Log activity
    this.createActivityLog({
      action: "equipment_added",
      description: `New equipment added: ${equipment.name}`,
      entityId: id,
      entityType: "equipment"
    });
    
    return newEquipment;
  }
  
  async updateEquipment(id: number, equipmentUpdate: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const existingEquipment = this.equipmentData.get(id);
    if (!existingEquipment) return undefined;
    
    const updatedEquipment = { ...existingEquipment, ...equipmentUpdate };
    this.equipmentData.set(id, updatedEquipment);
    
    // Log activity
    this.createActivityLog({
      action: "equipment_updated",
      description: `Equipment updated: ${updatedEquipment.name}`,
      entityId: id,
      entityType: "equipment"
    });
    
    return updatedEquipment;
  }
  
  // Activity Log methods
  async getActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogsData.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogIdCounter++;
    const newLog: ActivityLog = { ...log, id, timestamp: new Date() };
    this.activityLogsData.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
