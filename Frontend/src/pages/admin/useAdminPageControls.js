import { useEffect } from 'react'
import './ui-actions.js'

export function useAdminPageControls({ mobileNavigation = true } = {}) {
    useEffect(() => {
        const controller = new AbortController()
        const listen = (target, type, handler) =>
            target?.addEventListener(type, handler, { signal: controller.signal })
        const notificationToggle = document.getElementById('admin-notif-toggle')
        const notificationPanel = document.getElementById('admin-notif-panel')
        const profileToggle = document.getElementById('admin-profile-toggle')
        const profilePanel = document.getElementById('admin-profile-panel')
        const hamburger = document.getElementById('admin-hamburger')
        const drawer = document.getElementById('admin-mobile-drawer')
        const overlay = document.getElementById('admin-mobile-overlay')
        const closeButton = document.getElementById('admin-nav-close')

        const setPanelOpen = (toggle, panel, open) => {
            if (!toggle || !panel) return
            panel.hidden = !open
            panel.classList.toggle('is-open', open)
            toggle.setAttribute('aria-expanded', String(open))
        }
        const applyEventsFilter = () => {
            const activeFilter = document.querySelector('#events-tab-group [data-filter][aria-pressed="true"]')?.dataset.filter || 'pending'
            const category = new URLSearchParams(location.search).get('category')
            const rows = [...document.querySelectorAll('#events-list [data-status]')]
            let visible = 0
            rows.forEach(row => {
                const matches = row.dataset.status === activeFilter && (!category || row.dataset.category === category)
                row.hidden = !matches
                row.style.display = matches ? '' : 'none'
                if (matches) visible++
            })
            const empty = document.getElementById('events-empty')
            if (empty) {
                empty.hidden = visible > 0
                empty.style.display = visible > 0 ? 'none' : ''
            }
            document.querySelectorAll('#events-tab-group [data-filter]').forEach(button => {
                const count = [...document.querySelectorAll('#events-list [data-status]')]
                    .filter(row => row.dataset.status === button.dataset.filter && (!category || row.dataset.category === category)).length
                const countEl = button.querySelector('[data-filter-count]')
                if (countEl) countEl.textContent = `(${count})`
            })
            const banner = document.getElementById('events-category-banner')
            if (banner) {
                banner.hidden = !category
                banner.style.display = category ? '' : 'none'
                const name = document.getElementById('events-category-banner-name')
                if (name) name.textContent = category || ''
            }
        }
        let usersCurrentPage = 1
        const usersPageSize = 5

        const renderUsersPagination = (totalPages, currentPage) => {
            const paginationEl = document.getElementById('users-pagination')
            if (!paginationEl) return
            if (totalPages <= 1) {
                if (totalPages === 0) {
                    paginationEl.innerHTML = ''
                    return
                }
            }
            let html = `<button type="button" data-user-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`
            for (let p = 1; p <= totalPages; p++) {
                html += `<button type="button" data-user-page="${p}" aria-current="${p === currentPage}">${p}</button>`
            }
            html += `<button type="button" data-user-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`
            paginationEl.innerHTML = html
        }

        const applyUsersFilter = (resetPage = false) => {
            if (resetPage === true) usersCurrentPage = 1
            const activeFilter = document.querySelector('#users-tab-group [data-filter][aria-pressed="true"]')?.dataset.filter || 'all'
            const query = document.getElementById('users-search')?.value.trim().toLowerCase() || ''
            const allRows = [...document.querySelectorAll('#users-list [data-role]')]
            
            const matchingRows = allRows.filter(row => {
                const roleMatches = activeFilter === 'all' || row.dataset.role === activeFilter
                const searchMatches = !query || (row.dataset.name || '').toLowerCase().includes(query)
                return roleMatches && searchMatches
            })

            const totalPages = Math.ceil(matchingRows.length / usersPageSize) || 1
            if (usersCurrentPage > totalPages) usersCurrentPage = totalPages
            if (usersCurrentPage < 1) usersCurrentPage = 1

            const startIndex = (usersCurrentPage - 1) * usersPageSize
            const endIndex = startIndex + usersPageSize

            allRows.forEach(row => {
                row.setAttribute('hidden', '')
                row.style.setProperty('display', 'none', 'important')
            })

            matchingRows.forEach((row, index) => {
                if (index >= startIndex && index < endIndex) {
                    row.removeAttribute('hidden')
                    row.style.setProperty('display', 'grid', 'important')
                }
            })

            const empty = document.getElementById('users-empty')
            if (empty) {
                empty.hidden = matchingRows.length > 0
                empty.style.display = matchingRows.length > 0 ? 'none' : ''
            }

            const count = document.getElementById('users-count-label')
            if (count) {
                if (matchingRows.length === 0) {
                    count.textContent = '0 users'
                } else {
                    count.textContent = `Showing ${startIndex + 1}–${Math.min(endIndex, matchingRows.length)} of ${matchingRows.length} users`
                }
            }

            renderUsersPagination(totalPages, usersCurrentPage)
        }
        const closeDrawer = () => {
            drawer?.classList.remove('open')
            overlay?.classList.remove('open')
            document.body.style.overflow = ''
            hamburger?.setAttribute('aria-expanded', 'false')
        }
        const openDrawer = () => {
            if (!drawer || !overlay) return
            drawer.classList.add('open')
            overlay.classList.add('open')
            document.body.style.overflow = 'hidden'
            hamburger?.setAttribute('aria-expanded', 'true')
        }

        listen(notificationToggle, 'click', event => {
            event.stopPropagation()
            setPanelOpen(notificationToggle, notificationPanel, notificationPanel?.hidden)
            setPanelOpen(profileToggle, profilePanel, false)
        })
        listen(profileToggle, 'click', event => {
            event.stopPropagation()
            setPanelOpen(profileToggle, profilePanel, profilePanel?.hidden)
            setPanelOpen(notificationToggle, notificationPanel, false)
        })
        listen(document, 'click', event => {
            if (!notificationPanel?.contains(event.target) && event.target !== notificationToggle) setPanelOpen(notificationToggle, notificationPanel, false)
            if (!profilePanel?.contains(event.target) && event.target !== profileToggle) setPanelOpen(profileToggle, profilePanel, false)
        })
        if (mobileNavigation) {
            listen(hamburger, 'click', openDrawer)
            listen(closeButton, 'click', closeDrawer)
            listen(overlay, 'click', closeDrawer)
        }
        listen(document, 'keydown', event => {
            if (event.key !== 'Escape') return
            if (mobileNavigation) closeDrawer()
            setPanelOpen(notificationToggle, notificationPanel, false)
            setPanelOpen(profileToggle, profilePanel, false)
        })

        const eventTabs = document.getElementById('events-tab-group')
        listen(eventTabs, 'click', event => {
            const button = event.target.closest('[data-filter]')
            if (!button) return
            eventTabs.querySelectorAll('[data-filter]').forEach(tab => {
                const active = tab === button
                tab.setAttribute('aria-pressed', String(active))
                tab.classList.toggle('bg-primary', active)
                tab.classList.toggle('text-on-primary', active)
                tab.classList.toggle('bg-surface-container', !active)
                tab.classList.toggle('text-on-surface-variant', !active)
            })
            applyEventsFilter()
        })
        const usersTabs = document.getElementById('users-tab-group')
        listen(usersTabs, 'click', event => {
            const button = event.target.closest('[data-filter]')
            if (!button) return
            usersTabs.querySelectorAll('[data-filter]').forEach(tab => {
                const active = tab === button
                tab.setAttribute('aria-pressed', String(active))
                tab.classList.toggle('bg-primary', active)
                tab.classList.toggle('text-on-primary', active)
                tab.classList.toggle('bg-surface-container', !active)
                tab.classList.toggle('text-on-surface-variant', !active)
            })
            applyUsersFilter(true)
        })
        listen(document.getElementById('users-search'), 'input', () => applyUsersFilter(true))
        listen(document, 'click', event => {
            const btn = event.target.closest('#users-pagination button[data-user-page]')
            if (!btn || btn.disabled) return
            const targetPage = parseInt(btn.dataset.userPage, 10)
            if (targetPage >= 1 && targetPage !== usersCurrentPage) {
                usersCurrentPage = targetPage
                applyUsersFilter(false)
            }
        })
        window.refreshEventsFilter = applyEventsFilter
        window.refreshUsersFilter = applyUsersFilter
        applyEventsFilter()
        applyUsersFilter(true)

        const addDialog = document.getElementById('add-category-dialog')
        const deleteDialog = document.getElementById('delete-category-dialog')
        const categoryList = document.getElementById('category-list')
        const categoryForm = document.getElementById('add-category-form')
        const categoryName = document.getElementById('new-category-name')
        const deleteMessage = document.getElementById('delete-cat-message')
        let categoryBeingEdited = null
        let categoryBeingDeleted = null
        listen(document.getElementById('btn-add-category'), 'click', () => {
            categoryBeingEdited = null
            document.getElementById('add-category-title').textContent = 'Add category'
            document.getElementById('add-category-submit').textContent = 'Add category'
            categoryForm.reset()
            addDialog.showModal()
        })
        listen(document.getElementById('add-category-cancel'), 'click', () => addDialog.close())
        listen(categoryForm, 'submit', event => {
            event.preventDefault()
            const value = categoryName.value.trim()
            if (!value || !categoryList) return
            const duplicate = [...categoryList.querySelectorAll('.cat-name')].some(item => item !== categoryBeingEdited?.querySelector('.cat-name') && item.textContent.trim().toLowerCase() === value.toLowerCase())
            if (duplicate) {
                categoryName.setCustomValidity('This category already exists')
                categoryName.reportValidity()
                categoryName.setCustomValidity('')
                return
            }
            if (categoryBeingEdited) {
                categoryBeingEdited.querySelector('.cat-name').textContent = value
                categoryBeingEdited.querySelector('a').href = `/admin/events?category=${encodeURIComponent(value)}`
                categoryBeingEdited.querySelector('a').textContent = `${categoryBeingEdited.dataset.active} active`
            } else {
                const row = document.createElement('div')
                row.className = 'flex items-center justify-between rounded-xl bg-surface-container-low p-4'
                row.dataset.active = '0'
                row.innerHTML = `<div class="flex items-center gap-2 min-w-0"><span class="material-symbols-outlined text-on-surface-variant" aria-hidden="true" style="font-size:20px">category</span><span class="cat-name truncate"></span></div><div class="flex items-center gap-3 shrink-0"><a class="text-on-surface-variant hover:text-primary hover:underline"></a><div class="row-actions"><button type="button" data-act="edit" aria-label="Edit category"><span class="material-symbols-outlined" aria-hidden="true">edit</span></button><button type="button" data-act="delete" aria-label="Delete category"><span class="material-symbols-outlined" aria-hidden="true">delete</span></button></div></div>`
                row.querySelector('.cat-name').textContent = value
                const link = row.querySelector('a')
                link.href = `/admin/events?category=${encodeURIComponent(value)}`
                link.textContent = '0 active'
                categoryList.append(row)
            }
            addDialog.close()
        })
        listen(categoryList, 'click', event => {
            const button = event.target.closest('[data-act]')
            const row = button?.closest('[data-active]')
            if (!button || !row) return
            if (button.dataset.act === 'edit') {
                categoryBeingEdited = row
                categoryName.value = row.querySelector('.cat-name').textContent.trim()
                document.getElementById('add-category-title').textContent = 'Edit category'
                document.getElementById('add-category-submit').textContent = 'Save changes'
                addDialog.showModal()
            } else {
                categoryBeingDeleted = row
                deleteMessage.textContent = `Delete ${row.querySelector('.cat-name').textContent.trim()}?`
                deleteDialog.showModal()
            }
        })
        listen(document.getElementById('delete-cat-cancel'), 'click', () => deleteDialog.close())
        listen(document.getElementById('delete-cat-confirm'), 'click', () => {
            categoryBeingDeleted?.remove()
            categoryBeingDeleted = null
            deleteDialog.close()
        })

        return () => {
            controller.abort()
            closeDrawer()
            delete window.refreshEventsFilter
            delete window.refreshUsersFilter
        }
    }, [mobileNavigation])
}