import { customAlphabet} from "nanoid";
export function GenerateNanoid(){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    const code = customAlphabet(alphabet,6)
    return code()
}