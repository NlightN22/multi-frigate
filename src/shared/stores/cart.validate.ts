import { OrderingStage } from "./cart.store"

export const validate = (stage: OrderingStage) => {
    console.log("confirmStage", stage)
    switch (stage.stage) {
        case 0: {
            break
        }
        case 1: {
            break
        }
    }
    return validate
}

