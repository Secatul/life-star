interface RecipePanelProps {
  title: string
  items: string[]
}

export default function RecipePanel({ title, items }: RecipePanelProps) {
  return (
    <div className="absolute right-0 top-0 w-96 h-full bg-zinc-950 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item} className="text-sm text-zinc-400 mb-2">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  )
}