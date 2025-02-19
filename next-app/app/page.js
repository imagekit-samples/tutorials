"use client";
import Image from "next/image";
import house from "../public/house.png";
import { IKImage } from "imagekitio-next";
const imageURL = "https://ik.imagekit.io/igi7ywjzdi/resize-crop-nextjs-blog/house.png";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Home() {
  return (
    <div className="home">
      <h2>Resized static image</h2>
      <Image alt="House" src={house} height={300} width={300} />
      <h2>Resized remote image</h2>
      <Image alt="House" src={imageURL} height={300} width={300} />
      <h2>Resized remote image with fill</h2>
      <div style={{ position: "relative", width: "200px", height: "200px" }}>
        <Image alt="House" src={imageURL} fill={true} />
      </div>
      <h2>Cropping and image</h2>
      <div style={{ width: "200px", height: "200px", overflow: "hidden", position: "relative" }}>
        <Image src={imageURL} alt="Cropped Example" width={300} height={300} />
      </div>
      <h2>Rendered image using imageKit</h2>
      <IKImage urlEndpoint={urlEndpoint} path="/resize-crop-nextjs-blog/house.png" width={400} height={400} alt="Alt text" />
      <h2>Height and width manipulation</h2>
      <div className="relative dimension">
        <IKImage
          urlEndpoint={urlEndpoint}
          path="/resize-crop-nextjs-blog/house.png"
          transformation={[
            {
              height: 200,
              width: 200,
            },
          ]}
          alt="Alt text"
        />
      </div>
      <h2>Aspect ratio manipulation</h2>
      <div className="relative large-dimension">
        <IKImage
          urlEndpoint={urlEndpoint}
          path="/resize-crop-nextjs-blog/house.png"
          transformation={[
            {
              width: 200,
              ar: "2-3",
            },
          ]}
          alt="Alt text"
        />
      </div>
      <h2>Cropping an image with imageKit</h2>
      <div className="relative large-dimension">
        <IKImage
          urlEndpoint={urlEndpoint}
          path="/resize-crop-nextjs-blog/house.png"
          transformation={[
            {
              height: 300,
              width: 200,
              cropMode: "extract",
            },
          ]}
          alt="Alt text"
        />
      </div>
    </div>
  );
}
