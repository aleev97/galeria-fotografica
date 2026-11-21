import { Container } from './Container';
type Props = { title: string }

export function PagePlaceholder({ title }: Props) {
    return (
        <Container className="mx-auto max-w-5xl px-6 py-24">
           <h1 className="text-4xl">{title}</h1>
           <p className="mt-4 text-moon-300">En construcción.</p>
        </Container>              
    )
}