import { useEffect } from 'react'

/**
 * Sets the document title when the component mounts.
 * Replaces the invalid <meta>/<link> tags that were placed
 * inside component JSX bodies.
 */
export default function AppPageHead({ title }) {
    useEffect(() => {
        document.title = title
    }, [title])

    return null
}
