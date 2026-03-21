import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScroll() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl font-semibold text-clinical-800 dark:text-clinical-100">
              AI-powered clinical tools <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                Built for Physicians
              </span>
            </h2>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop"
          alt="Clinical AI dashboard showing analytics and workflow tools"
          width={1400}
          height={720}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
          loading="lazy"
        />
      </ContainerScroll>
    </div>
  );
}
