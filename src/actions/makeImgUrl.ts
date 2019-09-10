export default function makeImgUrl(url: string): string {
    return url.replace('.jpg', '.jpg?imageView&thumbnail=369x0&quality=75&tostatic=0')
}