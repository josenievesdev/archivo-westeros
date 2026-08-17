import '../styles/home.css'
import { BloodlineTeaser } from '../components/BloodlineTeaser'
import { FeaturedCharactersSection } from '../components/FeaturedCharactersSection'
import { GreatHousesSection } from '../components/GreatHousesSection'
import { HeroSection } from '../components/HeroSection'
import { HomeFooter } from '../components/HomeFooter'
import { ImmersionSection } from '../components/ImmersionSection'

export function InicioPage() {
  return (
    <div className="home-page">
      <HeroSection />
      <GreatHousesSection />
      <FeaturedCharactersSection />
      <BloodlineTeaser />
      <ImmersionSection />
      <HomeFooter />
    </div>
  )
}
