import { COSMETICS } from './config'

interface AvatarProps {
  src: string
  alt: string
  cosmeticId?: string | null
  className?: string
}

export function Avatar({ src, alt, cosmeticId, className = '' }: AvatarProps) {
  const cosmetic = COSMETICS.find((item) => item.id === cosmeticId)

  return (
    <span className={`avatar-with-cosmetic ${className}`}>
      <img src={src} alt={alt} />
      {cosmetic && (
        <i className="avatar-cosmetic" aria-label={`Предмет: ${cosmetic.name}`}>
          {cosmetic.icon}
        </i>
      )}
    </span>
  )
}
