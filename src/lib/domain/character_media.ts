import type { CanonicalCharacter, CanonicalCharacterId } from './canonical_entities'
import type { ThronesCharacterDto } from '../api/thronesapi/api_types'

export type CharacterMediaProvider = 'thronesapi'

export interface CharacterMedia {
  canonicalCharacterId: CanonicalCharacterId
  provider: CharacterMediaProvider
  providerId: number

  portraitUrl: string
  imageFileName?: string

  altText: string

  source: {
    provider: 'thronesapi'
    remoteUrl: string
  }
}

export function normalizeThronesCharacter(
  dto: ThronesCharacterDto,
  canonicalCharacter: CanonicalCharacter,
): CharacterMedia {
  // Validate imageUrl: must be http or https and hostname must be thronesapi.com or subdomain
  const imageUrl = dto.imageUrl
  if (!imageUrl) {
    throw new Error(`Invalid imageUrl: ${imageUrl}`)
  }
  let url: URL
  try {
    url = new URL(imageUrl)
  } catch {
    throw new Error(`Invalid imageUrl: ${imageUrl}`)
  }
  const protocol = url.protocol
  if (!(protocol === 'http:' || protocol === 'https:')) {
    throw new Error(`Invalid imageUrl protocol: ${protocol}`)
  }
  const hostname = url.hostname
   const parts = hostname.split('.');
   if (parts.length < 2 || parts[parts.length - 2] !== 'thronesapi' || parts[parts.length - 1] !== 'com') {
     throw new Error(`Invalid imageUrl hostname: ${hostname}`);
   }
 
   // Generate altText from the canonical character's name
   // We use the canonical character's name (which is already localized? Actually, the CanonicalCharacter.name is the original name from the API?).
   // But note: the CanonicalCharacter.name might be null? We have to check.
   // In our CanonicalCharacter, the name is string | null. However, we have editorial metadata that provides a preferredName.
   // We should use the preferredName from editorial if available, otherwise the name from the canonical character.
   // However, the instructions say: altText debe venir de nuestro CanonicalCharacter.
   // We can use the canonical character's name, but if it's null, we can use the editorial's preferredName? Or we can rely on the fact that the canonical character always has a name? Not necessarily.
 
   // Let's look at the CanonicalCharacter interface: name: string | null.
   // We have the editorial field that contains the preferredName (string). We can use that if available.
 
   const characterName = canonicalCharacter.editorial?.preferredName ?? canonicalCharacter.name
   let finalName: string
   if (characterName) {
     finalName = characterName
   } else {
     // Fallback to a generic string
     finalName = 'personaje'
   }
 
   return {
     canonicalCharacterId: canonicalCharacter.id,
     provider: 'thronesapi',
     providerId: dto.id,
     portraitUrl: dto.imageUrl,
     altText: `Retrato de ${finalName}`,
     source: {
       provider: 'thronesapi',
       remoteUrl: dto.imageUrl,
     },
   }
}