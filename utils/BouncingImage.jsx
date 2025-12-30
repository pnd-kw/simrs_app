import Image from "next/image";

export function BouncingImage({
  image = "",
  alt = "",
  width,
  height,
}) {
  return (
    <Image
      src={image}
      alt={alt}
      className="bouncing-fade-in"
      width={width}
      height={height}
    />
  );
}
