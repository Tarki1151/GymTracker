import { 
  users, type User, type InsertUser,
  members, type Member, type InsertMember,
  membershipPlans, type MembershipPlan, type InsertMembershipPlan,
  subscriptions, type Subscription, type InsertSubscription,
  payments, type Payment, type InsertPayment,
  attendance, type Attendance, type InsertAttendance,
  equipment, type Equipment, type InsertEquipment,
  activityLogs, type ActivityLog, type InsertActivityLog,
  settings, type Setting, type InsertSetting, type UpdateSetting
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Setting methods
  getSetting(key: string): Promise<Setting | undefined>;
  getSettings(): Promise<Setting[]>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;

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
  sessionStore: any;
}

export class MemStorage implements IStorage {
  // Storage collections
  private settingsData: Map<string, Setting>;
  private usersData: Map<number, User>;
  private membersData: Map<number, Member>;
  private membershipPlansData: Map<number, MembershipPlan>;
  private subscriptionsData: Map<number, Subscription>;
  private paymentsData: Map<number, Payment>;
  private attendanceData: Map<number, Attendance>;
  private equipmentData: Map<number, Equipment>;
  private activityLogsData: Map<number, ActivityLog>;
  
  // IDs counters
  private settingIdCounter: number;
  private userIdCounter: number;
  private memberIdCounter: number;
  private planIdCounter: number;
  private subscriptionIdCounter: number;
  private paymentIdCounter: number;
  private attendanceIdCounter: number;
  private equipmentIdCounter: number;
  private activityLogIdCounter: number;
  
  sessionStore: any;

  constructor() {
    this.settingsData = new Map();
    this.usersData = new Map();
    this.membersData = new Map();
    this.membershipPlansData = new Map();
    this.subscriptionsData = new Map();
    this.paymentsData = new Map();
    this.attendanceData = new Map();
    this.equipmentData = new Map();
    this.activityLogsData = new Map();
    
    this.settingIdCounter = 1;
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
  
  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    return Array.from(this.settingsData.values()).find(setting => setting.key === key);
  }
  
  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settingsData.values());
  }
  
  async createSetting(setting: InsertSetting): Promise<Setting> {
    const id = this.settingIdCounter++;
    const newSetting: Setting = { ...setting, id, updatedAt: new Date() };
    this.settingsData.set(id, newSetting);
    return newSetting;
  }
  
  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const setting = await this.getSetting(key);
    if (!setting) return undefined;
    
    const updatedSetting = { ...setting, value, updatedAt: new Date() };
    this.settingsData.set(setting.id, updatedSetting);
    
    // Log activity
    this.createActivityLog({
      action: "setting_updated",
      description: `Setting updated: ${key}`,
      entityType: "settings"
    });
    
    return updatedSetting;
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

// PostgreSQL tabanlı veritabanı depolama sınıfı
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
    
    // Initialize database with sample data
    this.initializeData();
  }
  
  // Veritabanını örnek verilerle başlatma
  private async initializeData() {
    try {
      // 1. Check if default data already exists
      const existingPlans = await this.getMembershipPlans();
      
      // 2. Create default membership plans if none exist
      if (existingPlans.length === 0) {
        await this.createMembershipPlan({
          name: "Temel Aylık",
          description: "Standart ekipman erişimi ile temel spor salonu girişi",
          duration: 30,
          price: "500",
          active: true
        });
        
        await this.createMembershipPlan({
          name: "Premium Aylık",
          description: "Tüm spor salonu tesislerine ve derslere tam erişim",
          duration: 30,
          price: "800",
          active: true
        });
        
        await this.createMembershipPlan({
          name: "Temel Yıllık",
          description: "Standart ekipman erişimi ile temel spor salonu girişi, yıllık indirim",
          duration: 365,
          price: "5000",
          active: true
        });
        
        await this.createMembershipPlan({
          name: "Elite Üç Aylık",
          description: "Kişisel antrenör seansları ile tüm tesislere tam erişim",
          duration: 90,
          price: "2000",
          active: true
        });
      }
      
      // 3. Create default settings if they don't exist
      const appNameSetting = await this.getSetting('appName');
      if (!appNameSetting) {
        await this.createSetting({ key: 'appName', value: 'TARABYA MARTE Fight Academy' });
      }
      
      const contactEmailSetting = await this.getSetting('contactEmail');
      if (!contactEmailSetting) {
        await this.createSetting({ key: 'contactEmail', value: 'info@tarabyamarte.com' });
      }
      
      const contactPhoneSetting = await this.getSetting('contactPhone');
      if (!contactPhoneSetting) {
        await this.createSetting({ key: 'contactPhone', value: '+90 555 123 4567' });
      }
      
      const addressSetting = await this.getSetting('address');
      if (!addressSetting) {
        await this.createSetting({ key: 'address', value: 'Tarabya, İstanbul, Türkiye' });
      }
      
      // 4. Örnek ekipman verileri ekle
      const existingEquipment = await this.getAllEquipment();
      if (existingEquipment.length === 0) {
        await this.createEquipment({
          name: "Boks Eldiveni",
          category: "Boks Ekipmanı",
          status: "İyi Durumda",
          notes: "Yeni alındı, sınıf kullanımı için",
          purchaseDate: "2024-01-15",
          purchasePrice: "1500",
          maintenanceDate: "2024-06-15"
        });
        
        await this.createEquipment({
          name: "Kum Torbası",
          category: "Boks Ekipmanı",
          status: "İyi Durumda",
          notes: "Ağır kullanım için dayanıklı, 50kg",
          purchaseDate: "2023-11-20",
          purchasePrice: "3500",
          maintenanceDate: "2024-05-20"
        });
        
        await this.createEquipment({
          name: "Dövüş Minderi",
          category: "Güreş/BJJ Ekipmanı",
          status: "İyi Durumda",
          notes: "10x10 metre, sınıf kullanımı için",
          purchaseDate: "2023-08-10",
          purchasePrice: "25000",
          maintenanceDate: "2024-08-10"
        });
        
        await this.createEquipment({
          name: "Muay Thai Şortu",
          category: "Giyim",
          status: "İyi Durumda",
          notes: "Çeşitli boyutlarda mevcut",
          purchaseDate: "2024-02-05",
          purchasePrice: "800",
          maintenanceDate: null
        });
        
        await this.createEquipment({
          name: "Koşu Bandı",
          category: "Kardio Ekipmanı",
          status: "Tamir Gerekli",
          notes: "Ekran arızalı, tamir için bakımda",
          purchaseDate: "2022-05-15",
          purchasePrice: "15000",
          maintenanceDate: "2024-03-01"
        });
      }
      
      // 5. Örnek üyeler ekle
      const existingMembers = await this.getMembers();
      if (existingMembers.length === 0) {
        await this.createMember({
          fullName: "Ahmet Yılmaz",
          email: "ahmet@example.com",
          phone: "+90 555 111 2233",
          address: "Beşiktaş, İstanbul",
          dateOfBirth: "1992-05-15",
          gender: "Erkek",
          emergencyContact: "Ayşe Yılmaz",
          emergencyPhone: "+90 555 111 2234",
          notes: "Boks ve MMA ile ilgileniyor",
          active: true
        });
        
        await this.createMember({
          fullName: "Zeynep Kaya",
          email: "zeynep@example.com",
          phone: "+90 555 222 3344",
          address: "Kadıköy, İstanbul",
          dateOfBirth: "1995-08-20",
          gender: "Kadın",
          emergencyContact: "Mehmet Kaya",
          emergencyPhone: "+90 555 222 3345",
          notes: "BJJ ve Kickbox derslerine katılıyor",
          active: true
        });
        
        await this.createMember({
          fullName: "Murat Demir",
          email: "murat@example.com",
          phone: "+90 555 333 4455",
          address: "Sarıyer, İstanbul",
          dateOfBirth: "1990-02-10",
          gender: "Erkek",
          emergencyContact: "Selin Demir",
          emergencyPhone: "+90 555 333 4456",
          notes: "Yalnızca akşam antrenmanlarına katılabiliyor",
          active: true
        });
        
        await this.createMember({
          fullName: "Ayşe Şahin",
          email: "ayse@example.com",
          phone: "+90 555 444 5566",
          address: "Bakırköy, İstanbul",
          dateOfBirth: "1997-11-25",
          gender: "Kadın",
          emergencyContact: "Ali Şahin",
          emergencyPhone: "+90 555 444 5567",
          notes: "Muay Thai üzerine yoğunlaşıyor",
          active: true
        });
        
        await this.createMember({
          fullName: "Kemal Öztürk",
          email: "kemal@example.com",
          phone: "+90 555 555 6677",
          address: "Taksim, İstanbul",
          dateOfBirth: "1988-07-30",
          gender: "Erkek",
          emergencyContact: "Deniz Öztürk",
          emergencyPhone: "+90 555 555 6678",
          notes: "Eski profesyonel boksör, şimdi hobi olarak devam ediyor",
          active: false
        });
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      ...user,
      createdAt: new Date()
    }).returning();
    return newUser;
  }

  // Member methods
  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async getMembers(): Promise<Member[]> {
    return db.select().from(members);
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values({
      ...member,
      createdAt: new Date()
    }).returning();
    
    // Log activity
    await this.createActivityLog({
      action: "member_added",
      description: `New member added: ${member.fullName}`,
      entityId: newMember.id,
      entityType: "members"
    });
    
    return newMember;
  }

  async updateMember(id: number, memberUpdate: Partial<InsertMember>): Promise<Member | undefined> {
    const [updatedMember] = await db.update(members)
      .set(memberUpdate)
      .where(eq(members.id, id))
      .returning();
    
    if (updatedMember) {
      // Log activity
      await this.createActivityLog({
        action: "member_updated",
        description: `Member updated: ${updatedMember.fullName}`,
        entityId: id,
        entityType: "members"
      });
    }
    
    return updatedMember || undefined;
  }
  
  // Membership Plan methods
  async getMembershipPlan(id: number): Promise<MembershipPlan | undefined> {
    const [plan] = await db.select().from(membershipPlans).where(eq(membershipPlans.id, id));
    return plan || undefined;
  }
  
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    return db.select().from(membershipPlans);
  }
  
  async createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan> {
    const [newPlan] = await db.insert(membershipPlans).values({
      ...plan,
      createdAt: new Date()
    }).returning();
    
    // Log activity
    await this.createActivityLog({
      action: "plan_added",
      description: `New membership plan added: ${plan.name}`,
      entityId: newPlan.id,
      entityType: "membership_plans"
    });
    
    return newPlan;
  }
  
  async updateMembershipPlan(id: number, planUpdate: Partial<InsertMembershipPlan>): Promise<MembershipPlan | undefined> {
    const [updatedPlan] = await db.update(membershipPlans)
      .set(planUpdate)
      .where(eq(membershipPlans.id, id))
      .returning();
    
    if (updatedPlan) {
      // Log activity
      await this.createActivityLog({
        action: "plan_updated",
        description: `Membership plan updated: ${updatedPlan.name}`,
        entityId: id,
        entityType: "membership_plans"
      });
    }
    
    return updatedPlan || undefined;
  }
  
  // Subscription methods
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }
  
  async getSubscriptions(): Promise<Subscription[]> {
    return db.select().from(subscriptions);
  }
  
  async getMemberSubscriptions(memberId: number): Promise<Subscription[]> {
    return db.select().from(subscriptions).where(eq(subscriptions.memberId, memberId));
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values({
      ...subscription,
      createdAt: new Date()
    }).returning();
    
    // Log activity
    const member = await this.getMember(subscription.memberId);
    const plan = await this.getMembershipPlan(subscription.planId);
    await this.createActivityLog({
      action: "subscription_added",
      description: `New subscription added for ${member?.fullName || 'Unknown'}: ${plan?.name || 'Unknown'}`,
      entityId: newSubscription.id,
      entityType: "subscriptions"
    });
    
    return newSubscription;
  }
  
  async updateSubscription(id: number, subscriptionUpdate: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db.update(subscriptions)
      .set(subscriptionUpdate)
      .where(eq(subscriptions.id, id))
      .returning();
    
    if (updatedSubscription) {
      // Log activity
      await this.createActivityLog({
        action: "subscription_updated",
        description: `Subscription updated: ID ${id}`,
        entityId: id,
        entityType: "subscriptions"
      });
    }
    
    return updatedSubscription || undefined;
  }
  
  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }
  
  async getPayments(): Promise<Payment[]> {
    return db.select().from(payments);
  }
  
  async getMemberPayments(memberId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.memberId, memberId));
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values({
      ...payment,
      createdAt: new Date()
    }).returning();
    
    // Log activity
    const member = await this.getMember(payment.memberId);
    await this.createActivityLog({
      action: "payment_received",
      description: `Payment received from ${member?.fullName || 'Unknown'}: $${payment.amount}`,
      entityId: newPayment.id,
      entityType: "payments"
    });
    
    return newPayment;
  }
  
  // Attendance methods
  async getAttendance(id: number): Promise<Attendance | undefined> {
    const [record] = await db.select().from(attendance).where(eq(attendance.id, id));
    return record || undefined;
  }
  
  async getAttendanceRecords(): Promise<Attendance[]> {
    return db.select().from(attendance);
  }
  
  async getMemberAttendance(memberId: number): Promise<Attendance[]> {
    return db.select().from(attendance).where(eq(attendance.memberId, memberId));
  }
  
  async createAttendance(attendanceRecord: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values({
      ...attendanceRecord,
      checkOutTime: null,
      createdAt: new Date()
    }).returning();
    
    // Log activity
    const member = await this.getMember(attendanceRecord.memberId);
    await this.createActivityLog({
      action: "check_in",
      description: `${member?.fullName || 'Unknown'} checked in`,
      entityId: newAttendance.id,
      entityType: "attendance"
    });
    
    return newAttendance;
  }
  
  async updateAttendance(id: number, attendanceUpdate: Partial<Attendance>): Promise<Attendance | undefined> {
    const [updatedAttendance] = await db.update(attendance)
      .set(attendanceUpdate)
      .where(eq(attendance.id, id))
      .returning();
    
    if (updatedAttendance && attendanceUpdate.checkOutTime) {
      // Log check-out activity
      const member = await this.getMember(updatedAttendance.memberId);
      await this.createActivityLog({
        action: "check_out",
        description: `${member?.fullName || 'Unknown'} checked out`,
        entityId: id,
        entityType: "attendance"
      });
    }
    
    return updatedAttendance || undefined;
  }
  
  // Equipment methods
  async getEquipment(id: number): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item || undefined;
  }
  
  async getAllEquipment(): Promise<Equipment[]> {
    return db.select().from(equipment);
  }
  
  async createEquipment(equipmentItem: InsertEquipment): Promise<Equipment> {
    const [newEquipment] = await db.insert(equipment).values({
      ...equipmentItem,
      createdAt: new Date()
    }).returning();
    
    // Log activity
    await this.createActivityLog({
      action: "equipment_added",
      description: `New equipment added: ${equipmentItem.name}`,
      entityId: newEquipment.id,
      entityType: "equipment"
    });
    
    return newEquipment;
  }
  
  async updateEquipment(id: number, equipmentUpdate: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const [updatedEquipment] = await db.update(equipment)
      .set(equipmentUpdate)
      .where(eq(equipment.id, id))
      .returning();
    
    if (updatedEquipment) {
      // Log activity
      await this.createActivityLog({
        action: "equipment_updated",
        description: `Equipment updated: ${updatedEquipment.name}`,
        entityId: id,
        entityType: "equipment"
      });
    }
    
    return updatedEquipment || undefined;
  }
  
  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }
  
  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }
  
  async createSetting(setting: InsertSetting): Promise<Setting> {
    const [newSetting] = await db.insert(settings).values({
      ...setting,
      updatedAt: new Date()
    }).returning();
    return newSetting;
  }
  
  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    
    if (!setting) {
      return this.createSetting({ key, value });
    }
    
    const [updatedSetting] = await db.update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key))
      .returning();
    
    return updatedSetting;
  }
  
  // Activity Log methods
  async getActivityLogs(): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp));
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values({
      ...log,
      timestamp: new Date()
    }).returning();
    return newLog;
  }
}

// Veritabanı depolama sınıfını kullan
export const storage = new DatabaseStorage();

// Varsayılan ayarları oluştur
(async () => {
  // Uygulama adı ayarını ekle (eğer yoksa)
  const appNameSetting = await storage.getSetting('appName');
  if (!appNameSetting) {
    await storage.createSetting({ key: 'appName', value: 'TarabyaMarte' });
  }
})();
