export interface Estado {
  id: number
  nombre: string
  imagen: string | null
  municipios: number
  slug: string
}

export interface Universidad {
  id: number
  nombre: string
  tipo: string
  sitio_web: string | null
  estado_id: number
  slug: string
}

export interface Carrera {
  id: number
  nombre: string
  grado: string
  universidad_id: number
}