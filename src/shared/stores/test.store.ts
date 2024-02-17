import axios from "axios"
import { makeAutoObservable, runInAction } from "mobx"


//todo delete
type Posts = {
    userId: number,
    id: number,
    title: string,
    body: string
}

const getPosts = async () => 
    (await axios.get<Posts[]>("https://jsonplaceholder.typicode.com/posts")).data


class PostStore {
    posts: Posts[] = []
    isLoading = false
    constructor() {
        makeAutoObservable(this)
    }

    getPostsAction = async () => {
        try {
            this.isLoading = true
            const res = await getPosts()
            runInAction( () => {
                this.posts = res
                this.isLoading = false
            })
        } catch {
            this.isLoading = false
        }
    }
}

export default PostStore