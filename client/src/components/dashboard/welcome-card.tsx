import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronsRight, Clock, Sun, Moon, Users, Calendar } from "lucide-react";

type Setting = {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
};

export default function WelcomeCard() {
  const { user } = useAuth();
  
  // Ayarlardan spor salonu adını almak için
  const { data: settings } = useQuery<Setting[]>({
    queryKey: ['/api/settings']
  });

  // Spor salonu adını ayarlardan getir
  const gymName = settings?.find(s => s.key === 'appName')?.value || 'TarabyaMarte';

  // Günün saatine göre selamlama mesajı
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        text: "Günaydın",
        icon: <Sun className="h-6 w-6 text-amber-500" />
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        text: "İyi günler",
        icon: <Sun className="h-6 w-6 text-amber-400" />
      };
    } else {
      return {
        text: "İyi akşamlar",
        icon: <Moon className="h-6 w-6 text-indigo-400" />
      };
    }
  };

  const greeting = getGreeting();
  
  // Haftanın günü
  const getDayOfWeek = () => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[new Date().getDay()];
  };
  
  // Tarih
  const getFormattedDate = () => {
    const date = new Date();
    return `${date.getDate()} ${date.toLocaleString('tr-TR', { month: 'long' })} ${date.getFullYear()}`;
  };

  // Card için animasyon varyantları
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  // İçerik için animasyon varyantları
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3 
      }
    }
  };
  
  // Metin öğeleri için animasyon varyantları
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 shadow-sm border border-primary-100"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex flex-col space-y-2"
        variants={contentVariants}
      >
        <motion.div className="flex items-center space-x-2" variants={itemVariants}>
          {greeting.icon}
          <h2 className="text-xl font-medium text-gray-800">
            {greeting.text}, <span className="text-primary font-semibold">{user?.fullName}</span>
          </h2>
        </motion.div>
        
        <motion.div className="text-gray-500 flex items-center space-x-2" variants={itemVariants}>
          <Calendar className="h-4 w-4" />
          <span>{getDayOfWeek()}, {getFormattedDate()}</span>
        </motion.div>
        
        <motion.div 
          className="mt-4 flex items-center text-sm text-primary-600"
          variants={itemVariants}
        >
          <Clock className="h-4 w-4 mr-1" />
          <span>Bugün {gymName}'de harika bir gün!</span>
        </motion.div>
        
        <motion.div 
          className="mt-4 flex justify-between items-center"
          variants={itemVariants}
        >
          <div className="flex space-x-6">
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Üyeler</span>
              <ChevronsRight className="h-4 w-4 text-primary-400" />
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Günlük Program</span>
              <ChevronsRight className="h-4 w-4 text-primary-400" />
            </motion.div>
          </div>
          
          <motion.div 
            className="text-xs text-gray-500"
            variants={itemVariants}
            whileHover={{ scale: 1.05, color: "#6366f1" }}
          >
            Gösterge paneli
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}