import { Swiper, Image } from 'antd-mobile'

const banners = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/banner1/800/400',
    title: '春季新品',
    subtitle: '焕新衣橱，遇见更好的自己',
    accent: 'from-olive-600/80 to-olive-800/60',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/banner2/800/400',
    title: '数码盛典',
    subtitle: '旗舰好物，限时特惠',
    accent: 'from-sea-600/80 to-sea-800/60',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/banner3/800/400',
    title: '居家美学',
    subtitle: '打造你的理想生活空间',
    accent: 'from-stone-600/70 to-stone-800/50',
  },
]

export default function HeroCarousel() {
  return (
    <section className="px-4 mt-4">
      <Swiper
        autoplay
        loop
        stuckAtBoundary={false}
        slideSize={100}
        trackOffset={0}
        indicator={(total, current) => (
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-5 bg-olive-600' : 'w-1.5 bg-stone-300'
                }`}
              />
            ))}
          </div>
        )}
        style={{ '--border-radius': '16px' }}
      >
        {banners.map((item) => (
          <Swiper.Item key={item.id}>
            <div className="relative rounded-2xl overflow-hidden aspect-[2/1] shadow-lg shadow-olive-900/10">
              <Image
                src={item.image}
                fit="cover"
                className="w-full h-full"
                lazy
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${item.accent}`} />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-cream-50">
                <p className="text-xs tracking-widest uppercase opacity-80 mb-1">
                  Featured
                </p>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm opacity-90 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </section>
  )
}
