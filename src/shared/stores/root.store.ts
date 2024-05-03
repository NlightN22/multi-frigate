import { MainStore } from "./main.store";
import { ModalStore } from "./modal.store";
import { RecordingsStore } from "./recordings.store";
import { SideBarsStore } from "./sidebars.store";
import { UserStore } from "./user.store";

class RootStore {
    mainStore: MainStore
    userStore: UserStore
    modalStore: ModalStore
    sideBarsStore: SideBarsStore
    recordingsStore: RecordingsStore
    constructor() {
        this.mainStore = new MainStore()
        this.userStore = new UserStore()
        this.modalStore = new ModalStore(this)
        this.sideBarsStore = new SideBarsStore()
        this.recordingsStore = new RecordingsStore()
    }
}

export default RootStore
