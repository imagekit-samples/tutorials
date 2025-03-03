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
      <h2>Cropped image</h2>
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
      <h2>Text overlay</h2>
      <div className="relative dimension">
        <IKImage
          urlEndpoint={urlEndpoint}
          path="/resize-crop-nextjs-blog/house.png"
          transformation={[{ width: 200, height: 200 }, { raw: "l-text,i-Imagekit,fs-50,l-end" }]}
          alt="Alt text"
        />
      </div>
      <h2>AI transformations</h2>
      <h3>Generative fill</h3>
      <div className="ai-container">
        <div>
          <h4>Original image</h4>
          <div className="relative generative-fill">
            <IKImage
              urlEndpoint={urlEndpoint}
              src="https://ik.imagekit.io/ikmedia/footwear.jpg"
              transformation={[{ width: 330, height: 320 }]}
              alt="Alt text"
            />
          </div>
        </div>
        <div>
          <h4>Transformed image</h4>
          <div className="relative generative-fill">
            <IKImage
              urlEndpoint={urlEndpoint}
              src="https://ik.imagekit.io/ikmedia/footwear.jpg"
              fill={true}
              transformation={[{ raw: "bg-genfill,w-1000,h-960,cm-pad_resize" }]}
              alt="Alt text"
            />
          </div>
        </div>
      </div>
      <h3>Object aware cropping</h3>
      <div className="ai-container">
        <div>
          <h4>Original image</h4>
          <div className="relative original-cropped-image">
            <IKImage
              urlEndpoint={urlEndpoint}
              src=" https://ik.imagekit.io/ikmedia/docs_images/features/image-transformations/catdog.jpeg"
              transformation={[{ width: 602, height: 332 }]}
              alt="Alt text"
            />
          </div>
        </div>
        <div>
          <h4>Transformed image</h4>
          <div className="relative object-aware-cropping">
            <IKImage
              urlEndpoint={urlEndpoint}
              src="https://ik.imagekit.io/ikmedia/docs_images/features/image-transformations/catdog.jpeg"
              fill={true}
              transformation={[{ fo: "dog" }]}
              alt="Alt text"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
