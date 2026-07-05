const ITEMS = [
    {
        title: "Achat",
        text: "Comparez les meilleurs prix chez des négociants certifiés, en toute transparence."
    },
    {
        title: "Export",
        text: "Naviguez les frontières et la fiscalité sans mauvaise surprise."
    },
    {
        title: "Revente",
        achat: "Revendez au bon moment et au bon endroit"
    }
]

export function Categories() {
    return (
        <section className="bg-white px-6 py-32 max-w-5xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl mb-20 max-w-2xl leading-tight">
            Ce qui nous distingue <em className="italic">fait toute la différence</em>
        </h2>
        <div className="space-y-10">
            {ITEMS.map((item) => (
            <div key={item.title} className="grid md:grid-cols-[200px_1fr] gap-6">
                <h3 className="font-serif font-semibold text-xl">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed max-w-xl">{item.text}</p>
            </div>
            ))}
        </div>
        </section>
    );
}