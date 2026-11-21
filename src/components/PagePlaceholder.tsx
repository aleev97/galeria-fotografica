type Props = { title: string }

export function PagePlaceholder({ title }: Props) {
    return (
        <section className="mx-auto max-w-5xl px-6 py-24">
           <h1 className="text-3xl font-bold">{title}</h1>
           <p className="mt-4 text-white/60">En construcción.</p>
        </section>              
    )
}