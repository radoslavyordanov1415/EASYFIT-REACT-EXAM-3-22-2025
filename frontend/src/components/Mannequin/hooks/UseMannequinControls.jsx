import { DEFAULT_WOMAN_IMAGE, DEFAULT_MAN_IMAGE } from "../constants/MannequinConstants"

export const useMannequinControls = (mannequinImage, setMannequinImage) => {
    const toggleMannequinGender = () => {
        setMannequinImage((current) => (current === DEFAULT_WOMAN_IMAGE ? DEFAULT_MAN_IMAGE : DEFAULT_WOMAN_IMAGE))
    }

    return {
        toggleMannequinGender,
    }
}

