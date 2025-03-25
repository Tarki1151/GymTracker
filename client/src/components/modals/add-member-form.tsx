import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertMemberSchema, InsertMember, Member } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertMember) => void;
  editMode?: boolean;
  member?: Member;
}

const formSchema = insertMemberSchema.extend({
  dateOfBirth: z.string().optional().transform(val => val ? new Date(val).toISOString() : undefined),
});

type FormValues = z.infer<typeof formSchema>;

export default function MemberForm({ isOpen, onClose, onSubmit, editMode = false, member }: MemberFormProps) {
  const { t } = useTranslation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      emergencyContact: "",
      emergencyPhone: "",
      notes: "",
      active: true,
    },
  });

  // Populate form when editing an existing member
  useEffect(() => {
    if (editMode && member) {
      const dateOfBirthFormatted = member.dateOfBirth 
        ? new Date(member.dateOfBirth).toISOString().split('T')[0] 
        : '';
      
      form.reset({
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        address: member.address || "",
        dateOfBirth: dateOfBirthFormatted,
        gender: member.gender || "",
        emergencyContact: member.emergencyContact || "",
        emergencyPhone: member.emergencyPhone || "",
        notes: member.notes || "",
        active: member.active === null ? true : member.active
      });
    }
  }, [editMode, member, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? t('members.editMember') : t('members.addMember')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('members.enterFullName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('members.enterEmail')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('members.enterPhone')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.dateOfBirth')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.gender')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('members.selectGender')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">{t('members.male')}</SelectItem>
                        <SelectItem value="female">{t('members.female')}</SelectItem>
                        <SelectItem value="other">{t('members.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.address')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('members.enterAddress')} 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.emergencyContact')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('members.enterEmergencyContact')} 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('members.emergencyPhone')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('members.enterEmergencyPhone')} 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('members.notes')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('members.enterNotes')} 
                      className="h-20" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editMode ? t('common.save') : t('members.addMember')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
