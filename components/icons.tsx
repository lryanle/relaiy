type IconProps = React.HTMLAttributes<SVGElement> & {
    width?: number;
    height?: number;
}

export const Icons = {
    Logo: (props: IconProps) => (
        <svg width={props?.width ?? 32} height={props?.height ?? 32} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="346.274" y="120" width="64" height="320" transform="rotate(45 346.274 120)" fill="currentColor"/>
            <rect x="165.421" y="120" width="64" height="200" transform="rotate(45 165.421 120)" fill="currentColor"/>
            <rect x="442.421" y="205" width="64" height="200" transform="rotate(45 442.421 205)" fill="currentColor"/>
        </svg>
    )
}