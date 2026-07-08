import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  CalendarCheck,
  UserPlus,
  Link2,
  ClipboardList,
  Search,
  LineChart,
  ShieldAlert,
  Sparkles,
  UserCog,
} from "lucide-react";

export const NAV_CONFIG = {
  ADMIN: [
    {
      group: "Overview",
      items: [{ label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true }],
    },
    {
      group: "Directory",
      items: [
        { label: "Students", to: "/admin/students", icon: Users },
        { label: "Tutors", to: "/admin/tutors", icon: GraduationCap },
      ],
    },
    {
      group: "Catalog",
      items: [
        { label: "Subjects", to: "/admin/subjects", icon: BookOpen },
        { label: "Assign subject", to: "/admin/assign-subject", icon: Link2 },
      ],
    },
    {
      group: "Operations",
      items: [
        { label: "Bookings", to: "/admin/bookings", icon: CalendarCheck },
        { label: "Create tutor", to: "/admin/create-tutor", icon: UserPlus },
        { label: "Create admin", to: "/admin/create-admin", icon: UserCog },
      ],
    },
  ],
  STUDENT: [
    {
      group: "Overview",
      items: [{ label: "Dashboard", to: "/student", icon: LayoutDashboard, end: true }],
    },
    {
      group: "Learning",
      items: [
        { label: "Browse subjects", to: "/student/subjects", icon: BookOpen },
        { label: "Find a tutor", to: "/student/find-tutor", icon: Search },
        { label: "AI recommendation", to: "/student/recommend", icon: Sparkles },
      ],
    },
    {
      group: "My activity",
      items: [
        { label: "My bookings", to: "/student/bookings", icon: ClipboardList },
        { label: "Performance", to: "/student/performance", icon: LineChart },
      ],
    },
  ],
  TUTOR: [
    {
      group: "Overview",
      items: [{ label: "Dashboard", to: "/tutor", icon: LayoutDashboard, end: true }],
    },
    {
      group: "Teaching",
      items: [
        { label: "My subjects", to: "/tutor/subjects", icon: BookOpen },
        { label: "Bookings", to: "/tutor/bookings", icon: CalendarCheck },
      ],
    },
    {
      group: "Insights",
      items: [
        { label: "Student performance", to: "/tutor/student-performance", icon: ShieldAlert },
        { label: "My profile", to: "/tutor/profile", icon: UserCog },
      ],
    },
  ],
};
