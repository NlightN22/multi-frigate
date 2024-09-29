import { MainStore } from "./main.store";
import { ModalStore } from "./modal.store";
import { RecordingsStore } from "./recordings.store";
import { UserStore } from "./user.store";

class RootStore {
    mainStore: MainStore
    userStore: UserStore
    modalStore: ModalStore
    recordingsStore: RecordingsStore
    constructor() {
        this.mainStore = new MainStore()
        this.userStore = new UserStore()
        this.modalStore = new ModalStore(this)
        this.recordingsStore = new RecordingsStore()
    }
}

export default RootStore
