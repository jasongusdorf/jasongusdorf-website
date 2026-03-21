import { Home, FlaskConical, Workflow, BookOpen, Wrench, LayoutTemplate, Users, Info, Heart } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Trials', url: '/trials', icon: FlaskConical },
  { name: 'Workflows', url: '/workflows', icon: Workflow },
  { name: 'Guides', url: '/guides', icon: BookOpen },
  { name: 'Tools', url: '/tools', icon: Wrench },
  { name: 'Templates', url: '/templates', icon: LayoutTemplate },
  { name: 'Community', url: 'https://community.llmsfordoctors.com', icon: Users },
  { name: 'About', url: '/about', icon: Info },
  { name: 'Donate', url: '/donate', icon: Heart },
]

export default function TubelightNav() {
  return <NavBar items={navItems} />
}
