import { useState, useEffect } from 'react'
import { Swiper, Image } from 'antd-mobile'
import { getHomeBanners } from '@/utils/api'

const FALLBACK_BANNERS = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/banner1/800/400',
    title: '春季新品',
    subtitle: '焕新衣橱，遇见更好的自己',
    themeColor: '#4a6340',
    themeRgb: '74, 99, 64',
  },
]

export default function HomeSwiper({ onThemeChange }) {
  const [banners, setBanners] = useState(FALLBACK_BANNERS)

  useEffect(() => {
    getHomeBanners()
      .then((res) => {
        if (res.data?.length) {
          setBanners(res.data)
          onThemeChange?.(res.data[0])
        }
      })
      .catch(() => {})
  }, [onThemeChange])

  const handleIndexChange = (index) => {
    onThemeChange?.(banners[index] || banners[0])
  }

  return (
    <section className="relative px-4">
      <div
        className="rounded-2xl overflow-hidden backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(248, 246, 240, 0.4)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(43, 55, 40, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
      <Swiper
        autoplay
        loop
        stuckAtBoundary={false}
        slideSize={100}
        trackOffset={0}
        onIndexChange={handleIndexChange}
        indicator={(total, current) => (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-5 bg-cream-50' : 'w-1.5 bg-cream-50/40'
                }`}
              />
            ))}
          </div>
        )}
        style={{ '--border-radius': '0px' }}
      >
        {banners.map((item) => (
          <Swiper.Item key={item.id}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={item.image} fit="cover" className="w-full h-full" lazy />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 50%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 pb-8 text-cream-50">
                <p className="text-[10px] tracking-widest uppercase opacity-80 mb-1">Featured</p>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm opacity-90 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
      </div>
    </section>
  )
}
