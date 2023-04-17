import useSWR from 'swr'
import { GET, POST } from './_config'

export const useUser = (id: number) => useSWR([`/users/${id}`], GET)
