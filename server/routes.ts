import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertMemberSchema, 
  insertMembershipPlanSchema, 
  insertSubscriptionSchema,
  insertPaymentSchema,
  insertAttendanceSchema,
  insertEquipmentSchema,
  updateSettingSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Members routes
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      const newMember = await storage.createMember(memberData);
      res.status(201).json(newMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create member" });
    }
  });

  app.patch("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memberData = insertMemberSchema.partial().parse(req.body);
      const updatedMember = await storage.updateMember(id, memberData);
      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(updatedMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  // Membership Plans routes
  app.get("/api/membership-plans", async (req, res) => {
    try {
      const plans = await storage.getMembershipPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership plans" });
    }
  });

  app.get("/api/membership-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getMembershipPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Membership plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership plan" });
    }
  });

  app.post("/api/membership-plans", async (req, res) => {
    try {
      const planData = insertMembershipPlanSchema.parse(req.body);
      const newPlan = await storage.createMembershipPlan(planData);
      res.status(201).json(newPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create membership plan" });
    }
  });

  app.patch("/api/membership-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const planData = insertMembershipPlanSchema.partial().parse(req.body);
      const updatedPlan = await storage.updateMembershipPlan(id, planData);
      if (!updatedPlan) {
        return res.status(404).json({ message: "Membership plan not found" });
      }
      res.json(updatedPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update membership plan" });
    }
  });

  // Subscriptions routes
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  app.get("/api/members/:id/subscriptions", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const subscriptions = await storage.getMemberSubscriptions(memberId);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member subscriptions" });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      const newSubscription = await storage.createSubscription(subscriptionData);
      res.status(201).json(newSubscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.patch("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscriptionData = insertSubscriptionSchema.partial().parse(req.body);
      const updatedSubscription = await storage.updateSubscription(id, subscriptionData);
      if (!updatedSubscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json(updatedSubscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Payments routes
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get("/api/members/:id/payments", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const payments = await storage.getMemberPayments(memberId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const newPayment = await storage.createPayment(paymentData);
      res.status(201).json(newPayment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record payment" });
    }
  });

  // Attendance routes
  app.get("/api/attendance", async (req, res) => {
    try {
      const attendance = await storage.getAttendanceRecords();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance records" });
    }
  });

  app.get("/api/members/:id/attendance", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const attendance = await storage.getMemberAttendance(memberId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      // Custom schema validation to handle ISO string for checkInTime
      const attendanceData = z.object({
        memberId: z.number(),
        checkInTime: z.string().transform(val => new Date(val))
      }).parse(req.body);
      
      const newAttendance = await storage.createAttendance(attendanceData);
      res.status(201).json(newAttendance);
    } catch (error) {
      console.error("Attendance error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid attendance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record attendance" });
    }
  });

  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const attendanceData = z.object({
        checkOutTime: z.string().transform(val => new Date(val))
      }).parse(req.body);
      
      const updatedAttendance = await storage.updateAttendance(id, {
        checkOutTime: attendanceData.checkOutTime
      });
      
      if (!updatedAttendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.json(updatedAttendance);
    } catch (error) {
      console.error("Check-out error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid attendance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update attendance" });
    }
  });

  // Equipment routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const equipment = await storage.getAllEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const equipment = await storage.getEquipment(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const equipmentData = insertEquipmentSchema.parse(req.body);
      const newEquipment = await storage.createEquipment(equipmentData);
      res.status(201).json(newEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });

  app.patch("/api/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const equipmentData = insertEquipmentSchema.partial().parse(req.body);
      const updatedEquipment = await storage.updateEquipment(id, equipmentData);
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.json(updatedEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });

  // Activity logs route
  app.get("/api/activity-logs", async (req, res) => {
    try {
      const logs = await storage.getActivityLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  
  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  
  app.patch("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      // Sadece değer alanını al, body'den doğrudan value property'sini kontrol et
      const { value } = req.body;
      
      if (!value) {
        return res.status(400).json({ message: "Missing value field" });
      }
      
      const updatedSetting = await storage.updateSetting(key, value);
      if (!updatedSetting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(updatedSetting);
    } catch (error) {
      console.error("Setting update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Dashboard data route
  app.get("/api/dashboard", async (req, res) => {
    try {
      const members = await storage.getMembers();
      const activeMembers = members.filter(member => member.active);
      const subscriptions = await storage.getSubscriptions();
      const activeSubscriptions = subscriptions.filter(
        sub => sub.status === "active" && new Date(sub.endDate) >= new Date()
      );
      const payments = await storage.getPayments();
      
      // Calculate monthly revenue
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthlyPayments = payments.filter(
        payment => new Date(payment.paymentDate) >= firstDayOfMonth
      );
      const monthlyRevenue = monthlyPayments.reduce(
        (total, payment) => total + Number(payment.amount), 0
      );
      
      // Get today's attendance
      const attendanceRecords = await storage.getAttendanceRecords();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAttendance = attendanceRecords.filter(
        record => new Date(record.checkInTime) >= today
      );
      
      // Get recent activity logs
      const activityLogs = await storage.getActivityLogs();
      const recentActivity = activityLogs.slice(0, 10);
      
      // Get expiring memberships
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const expiringSubscriptions = activeSubscriptions
        .filter(sub => {
          const endDate = new Date(sub.endDate);
          return endDate <= thirtyDaysFromNow && endDate >= today;
        })
        .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        .slice(0, 10);
      
      // Enrich expiring subscriptions with member details
      const expiringMemberships = await Promise.all(
        expiringSubscriptions.map(async (sub) => {
          const member = await storage.getMember(sub.memberId);
          const plan = await storage.getMembershipPlan(sub.planId);
          return {
            subscription: sub,
            member,
            plan
          };
        })
      );
      
      res.json({
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        monthlyRevenue,
        todayVisits: todayAttendance.length,
        recentActivity,
        expiringMemberships
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Reports data endpoint
  app.get("/api/reports", async (req, res) => {
    try {
      const members = await storage.getMembers();
      const activeMembers = members.filter(member => member.active);
      const membershipPlans = await storage.getMembershipPlans();
      const subscriptions = await storage.getSubscriptions();
      const activeSubscriptions = subscriptions.filter(
        sub => sub.status === "active" && new Date(sub.endDate) >= new Date()
      );
      const payments = await storage.getPayments();
      const attendanceRecords = await storage.getAttendanceRecords();
      
      // Current date information
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const today = new Date(currentDate);
      today.setHours(0, 0, 0, 0);
      
      // Calculate member growth by month for the past year
      const membersByMonth = [];
      for (let i = 0; i < 12; i++) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Count members registered before the end of this month
        const monthEnd = new Date(year, month + 1, 0);
        const count = members.filter(member => 
          new Date(member.createdAt) <= monthEnd
        ).length;
        
        membersByMonth.unshift({
          month: monthNames[month],
          count
        });
      }
      
      // Calculate membership plan distribution
      const membershipDistribution = membershipPlans.map(plan => {
        const planSubscriptions = subscriptions.filter(sub => 
          sub.planId === plan.id && sub.status === 'active'
        );
        
        return {
          name: plan.name,
          value: planSubscriptions.length
        };
      }).filter(item => item.value > 0);
      
      // Calculate revenue by month for the past year
      const revenueByMonth = [];
      for (let i = 0; i < 12; i++) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Get first and last day of the month
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);
        
        // Calculate revenue for this month
        const monthPayments = payments.filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        });
        
        const revenue = monthPayments.reduce(
          (total, payment) => total + Number(payment.amount), 0
        );
        
        revenueByMonth.unshift({
          month: monthNames[month],
          revenue
        });
      }
      
      // Calculate attendance by day of week
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const attendanceByDay = Array(7).fill(0).map((_, index) => {
        return { day: daysOfWeek[index], count: 0 };
      });
      
      // Count attendance for each day of the week
      attendanceRecords.forEach(record => {
        const day = new Date(record.checkInTime).getDay(); // 0 = Sunday, 6 = Saturday
        attendanceByDay[day].count += 1;
      });
      
      // Get expiring memberships
      // Today
      const expiringToday = activeSubscriptions.filter(sub => {
        const endDate = new Date(sub.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate.getTime() === today.getTime();
      }).length;
      
      // This week
      const weekFromToday = new Date(today);
      weekFromToday.setDate(today.getDate() + 7);
      
      const expiringThisWeek = activeSubscriptions.filter(sub => {
        const endDate = new Date(sub.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate > today && endDate <= weekFromToday;
      }).length;
      
      // This month
      const monthFromToday = new Date(today);
      monthFromToday.setMonth(today.getMonth() + 1);
      
      const expiringThisMonth = activeSubscriptions.filter(sub => {
        const endDate = new Date(sub.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate > weekFromToday && endDate <= monthFromToday;
      }).length;
      
      // Expired, not renewed
      const expired = subscriptions.filter(sub => 
        sub.status === 'expired' && new Date(sub.endDate) < today
      ).length;
      
      // Calculate member statistics
      const newMembersThisMonth = members.filter(member => {
        const createdAt = new Date(member.createdAt);
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return createdAt >= firstDayOfMonth;
      }).length;
      
      // Gender ratio calculation - using a dummy value since we don't track gender
      // In a real app, you would use actual gender data from member profiles
      const genderRatio = "60% / 38% / 2%";
      
      // Age distribution calculation - using dummy values for the same reason
      // In a real app, you would calculate this from member birth date/age data
      const ageDistribution = [
        { name: "18-25", value: 85 },
        { name: "26-35", value: 165 },
        { name: "36-45", value: 120 },
        { name: "46+", value: 88 },
      ];
      
      // Subscription statistics
      const totalSubscriptions = subscriptions.length;
      const activeSubscriptionsCount = activeSubscriptions.length;
      
      // Renewal rate and average subscription length would be calculated from historical data
      // Using placeholder values for now
      const renewalRate = "76%";
      const avgSubscriptionLength = "7.2 months";
      
      // Revenue statistics for current year and previous year
      const thisYearStart = new Date(currentYear, 0, 1);
      const lastYearStart = new Date(currentYear - 1, 0, 1);
      const lastYearEnd = new Date(currentYear - 1, 11, 31);
      
      const thisYearRevenue = payments
        .filter(payment => new Date(payment.paymentDate) >= thisYearStart)
        .reduce((total, payment) => total + Number(payment.amount), 0);
      
      const lastYearRevenue = payments
        .filter(payment => {
          const date = new Date(payment.paymentDate);
          return date >= lastYearStart && date <= lastYearEnd;
        })
        .reduce((total, payment) => total + Number(payment.amount), 0);
      
      const revenueGrowth = lastYearRevenue > 0 
        ? ((thisYearRevenue - lastYearRevenue) / lastYearRevenue * 100).toFixed(1) 
        : "N/A";
      
      // Popular times calculation based on check-in times
      const hourCounts = Array(24).fill(0);
      
      attendanceRecords.forEach(record => {
        const hour = new Date(record.checkInTime).getHours();
        hourCounts[hour]++;
      });
      
      // Find the most popular hours (top 3)
      const topHours = hourCounts
        .map((count, index) => ({ hour: index, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(item => {
          const hour = item.hour;
          const period = hour >= 12 ? "PM" : "AM";
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${displayHour}${period}`;
        })
        .join(", ");
      
      res.json({
        members: {
          membersByMonth,
          totalMembers: members.length,
          activeMembers: activeMembers.length,
          newMembersThisMonth,
          genderRatio,
          ageDistribution
        },
        memberships: {
          membershipDistribution,
          totalSubscriptions,
          activeSubscriptions: activeSubscriptionsCount,
          renewalRate,
          avgSubscriptionLength,
          expiringToday,
          expiringThisWeek,
          expiringThisMonth,
          expired
        },
        revenue: {
          revenueByMonth,
          thisYearRevenue,
          lastYearRevenue,
          revenueGrowth,
          currentMonthRevenue: revenueByMonth.length > 0 ? revenueByMonth[revenueByMonth.length - 1].revenue : 0,
          previousMonthRevenue: revenueByMonth.length > 1 ? revenueByMonth[revenueByMonth.length - 2].revenue : 0
        },
        attendance: {
          attendanceByDay,
          topHours,
          totalAttendance: attendanceRecords.length,
          averageDaily: Math.round(attendanceRecords.length / Math.max(1, 
            // Using last 30 days for average calculation
            [...new Set(attendanceRecords
              .filter(record => new Date(record.checkInTime) >= new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000))
              .map(record => new Date(record.checkInTime).toDateString())
            )].length
          ))
        }
      });
    } catch (error) {
      console.error("Reports API error:", error);
      res.status(500).json({ message: "Failed to fetch reports data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
