
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    name: "Social Media Post",
    json: '{"version":"5.3.0","objects":[{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":900,"height":900,"fill":"#E6E6FA","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":250,"top":300,"width":400,"height":100,"fill":"#333333","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"text":"Hello World","fontSize":60,"fontWeight":"bold","fontFamily":"Arial","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"center","textBackgroundColor":"","charSpacing":0,"minWidth":20,"splitByGrapheme":false}]}',
    width: 900,
    height: 900,
    isTemplate: true,
    isPublished: true,
    isPro: false,
    thumbnailUrl: "https://placehold.co/900x900/E6E6FA/333333?text=Social+Post",
  },
  {
    name: "Business Card",
    json: '{"version":"5.3.0","objects":[{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":600,"height":350,"fill":"#FFFFFF","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":300,"width":600,"height":50,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":50,"top":50,"width":300,"height":40,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"text":"John Doe","fontSize":32,"fontWeight":"bold","fontFamily":"Arial","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"left","textBackgroundColor":"","charSpacing":0,"minWidth":20,"splitByGrapheme":false}]}',
    width: 600,
    height: 350,
    isTemplate: true,
    isPublished: true,
    isPro: false,
    thumbnailUrl: "https://placehold.co/600x350/FFFFFF/000000?text=Business+Card",
  },
  {
    name: "Pro Banner",
    json: '{"version":"5.3.0","objects":[{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":1200,"height":400,"fill":"#FFD700","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"textbox","version":"5.3.0","originX":"left","originY":"top","left":100,"top":150,"width":1000,"height":100,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"text":"PREMIUM SALE","fontSize":80,"fontWeight":"bold","fontFamily":"Arial","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"center","textBackgroundColor":"","charSpacing":0,"minWidth":20,"splitByGrapheme":false}]}',
    width: 1200,
    height: 400,
    isTemplate: true,
    isPublished: true,
    isPro: true,
    thumbnailUrl: "https://placehold.co/1200x400/FFD700/000000?text=Premium+Banner",
  },
];

async function main() {
  console.log("Seeding templates...");

  // Create a placeholder user for templates if none exists
  const user = await prisma.user.upsert({
    where: { email: "admin@canva.clone" },
    update: {},
    create: {
      email: "admin@canva.clone",
      name: "Admin",
      id: "admin-user",
    }
  });

  for (const template of templates) {
    await prisma.project.create({
      data: {
        ...template,
        userId: user.id,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
