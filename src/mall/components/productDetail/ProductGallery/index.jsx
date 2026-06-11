import { Swiper, Image } from 'antd-mobile'

export default function ProductGallery({ images = [] }) {
  const list = images.length ? images : []

  if (!list.length) return null

  return (
    <section className="relative bg-stone-900">
      <Swiper
        loop={list.length > 1}
        indicator={(total, current) => (
          <div className="absolute bottom-4 right-4 z-10 px-2.5 py-0.5 rounded-full bg-black/40 text-white text-xs tabular-nums">
            {current + 1}/{total}
          </div>
        )}
      >
        {list.map((src, index) => (
          <Swiper.Item key={index}>
            <Image src={src} fit="cover" className="w-full aspect-square" lazy />
          </Swiper.Item>
        ))}
      </Swiper>
    </section>
  )
}
