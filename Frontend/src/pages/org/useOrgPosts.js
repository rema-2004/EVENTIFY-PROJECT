import { useEffect } from 'react'

const POSTS_KEY = 'eventify:org-posts'
const DELETED_KEY = 'eventify:org-deleted-posts'

function readList(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]')
    } catch {
        return []
    }
}

function showToast(message, tone = 'success') {
    if (window.EventifyUI) window.EventifyUI.toast(message, tone)
}

export function useOrgPosts() {
    useEffect(() => {
        const controller = new AbortController()
        const listen = (target, type, handler) =>
            target?.addEventListener(type, handler, { signal: controller.signal })
        const content = document.getElementById('post-content')
        const imageInput = document.getElementById('postImageInput')
        const imageName = document.getElementById('composerImageName')
        const addImage = document.getElementById('addImageBtn')
        const publish = document.getElementById('publishPostBtn')
        const posts = document.getElementById('publishedPosts')
        const postsCount = document.getElementById('postsCount')
        const loadMore = document.getElementById('loadMoreBtn')
        const listContainer = document.getElementById('postsListContainer')
        const viewAll = document.getElementById('viewAllPostsBtn')
        const modal = document.getElementById('postModal')
        let editingPost = null

        if (!posts) return () => controller.abort()

        const updateCount = () => {
            if (postsCount) postsCount.textContent = `${posts.querySelectorAll('[data-post]').length} updates`
        }

        const makePost = post => {
            const card = document.createElement('article')
            card.className = 'soft-card premium-card rounded-[28px] p-6 org-custom-post'
            card.dataset.post = ''
            card.dataset.postId = post.id

            const header = document.createElement('div')
            header.className = 'flex items-start justify-between gap-4'
            const identity = document.createElement('div')
            identity.className = 'flex gap-3'
            const avatar = document.createElement('div')
            avatar.className = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-label-md font-semibold text-primary'
            avatar.textContent = 'TG'
            const author = document.createElement('div')
            const orgName = document.createElement('p')
            orgName.className = 'font-semibold text-on-surface'
            orgName.textContent = 'TechGenius Labs'
            const meta = document.createElement('p')
            meta.className = 'text-sm text-on-surface-variant'
            meta.textContent = `${new Date(post.createdAt).toLocaleString()} · Announcement`
            author.append(orgName, meta)
            identity.append(avatar, author)
            const actions = document.createElement('div')
            actions.className = 'flex shrink-0 gap-1'
            actions.innerHTML = '<button class="rounded-lg p-2 text-on-surface-variant" type="button" aria-label="Edit post"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="rounded-lg p-2 text-error" type="button" aria-label="Delete post"><span class="material-symbols-outlined text-[18px]">delete</span></button>'
            header.append(identity, actions)
            const body = document.createElement('p')
            body.className = 'mt-4 text-body-md text-on-surface-variant'
            body.dataset.postBody = ''
            body.textContent = post.body
            card.append(header, body)
            if (post.image) {
                const image = document.createElement('img')
                image.src = post.image
                image.alt = ''
                image.className = 'mt-4 max-h-80 w-full rounded-xl object-cover'
                card.append(image)
            }
            return card
        }

        const savedPosts = readList(POSTS_KEY)
        savedPosts.forEach(post => posts.prepend(makePost(post)))
        const deletedIds = new Set(readList(DELETED_KEY))
        posts.querySelectorAll('[data-post]').forEach((card, index) => {
            card.dataset.postId ||= `org-seed-${index}`
            if (deletedIds.has(card.dataset.postId)) card.remove()
        })
        updateCount()

        listen(addImage, 'click', () => imageInput?.click())
        listen(imageInput, 'change', () => {
            const file = imageInput.files?.[0]
            if (!file) return
            if (file.size > 2 * 1024 * 1024) {
                imageInput.value = ''
                showToast('Choose an image smaller than 2 MB', 'error')
                return
            }
            imageName.textContent = file.name
            imageName.classList.remove('hidden')
        })

        listen(publish, 'click', async () => {
            const bodyText = content?.value.trim()
            if (!bodyText) {
                showToast('Write something before publishing', 'error')
                content?.focus()
                return
            }
            const file = imageInput?.files?.[0]
            let image = ''
            if (file) {
                image = await new Promise(resolve => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(String(reader.result || ''))
                    reader.onerror = () => resolve('')
                    reader.readAsDataURL(file)
                })
            }
            if (editingPost) {
                const body = editingPost.querySelector('[data-post-body]')
                if (body) body.textContent = bodyText
                if (editingPost.classList.contains('org-custom-post')) {
                    const items = readList(POSTS_KEY)
                    const saved = items.find(item => item.id === editingPost.dataset.postId)
                    if (saved) saved.body = bodyText
                    localStorage.setItem(POSTS_KEY, JSON.stringify(items))
                }
                editingPost = null
                publish.textContent = 'Publish'
                showToast('Post updated')
            } else {
                const post = { id: `post-${Date.now()}`, body: bodyText, image, createdAt: Date.now() }
                posts.prepend(makePost(post))
                const items = readList(POSTS_KEY)
                items.unshift(post)
                localStorage.setItem(POSTS_KEY, JSON.stringify(items))
                showToast('Post published')
            }
            content.value = ''
            if (imageInput) imageInput.value = ''
            if (imageName) {
                imageName.textContent = ''
                imageName.classList.add('hidden')
            }
            updateCount()
        })

        listen(posts, 'click', event => {
            const editButton = event.target.closest('button[aria-label="Edit post"]')
            const deleteButton = event.target.closest('button[aria-label="Delete post"]')
            const card = event.target.closest('[data-post]')
            if (!card) return
            if (editButton) {
                editingPost = card
                content.value = card.querySelector('[data-post-body]')?.textContent || ''
                publish.textContent = 'Update post'
                content.focus()
            } else if (deleteButton) {
                if (card.classList.contains('org-custom-post')) {
                    localStorage.setItem(POSTS_KEY, JSON.stringify(readList(POSTS_KEY).filter(post => post.id !== card.dataset.postId)))
                } else {
                    const removed = readList(DELETED_KEY)
                    removed.push(card.dataset.postId)
                    localStorage.setItem(DELETED_KEY, JSON.stringify([...new Set(removed)]))
                }
                if (editingPost === card) {
                    editingPost = null
                    publish.textContent = 'Publish'
                }
                card.remove()
                updateCount()
                showToast('Post deleted')
            }
        })

        listen(loadMore, 'click', () => {
            loadMore.disabled = true
            loadMore.textContent = 'All posts loaded'
        })
        listen(viewAll, 'click', () => {
            const isHidden = listContainer.classList.toggle('hidden')
            viewAll.textContent = isHidden ? 'View all posts' : 'Hide posts'
        })

        const closeModal = () => modal?.classList.add('hidden')
        listen(document, 'click', event => {
            const discoverCard = event.target.closest('button[data-title]')
            if (discoverCard && modal) {
                document.getElementById('modalOrg').textContent = discoverCard.dataset.org || 'Organization'
                document.getElementById('modalTitle').textContent = discoverCard.dataset.title
                document.getElementById('modalBody').textContent = discoverCard.dataset.body || ''
                document.getElementById('modalMeta').textContent = discoverCard.dataset.meta || ''
                modal.classList.remove('hidden')
                modal.classList.add('flex')
            }
            if (event.target === modal) closeModal()
        })
        listen(document.getElementById('closeModalBtn'), 'click', closeModal)
        listen(document.getElementById('modalActionBtn'), 'click', closeModal)

        return () => controller.abort()
    }, [])
}