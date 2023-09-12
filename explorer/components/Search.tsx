'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { isValidEthereumAddress } from '@/lib/ethers'

export function Search() {
	const router = useRouter()
	const [id, setId] = useState('')
	const [isValid, setIsValid] = useState(false)
	const [type, setType] = useState<'protocol' | 'policy' | null>(null)

	useEffect(() => {
		if (isValidEthereumAddress(id)) {
			setIsValid(true)
			setType('protocol')
		} else {
			setIsValid(false)
			setType(null)
		}
	}, [id])

	const handleKeyDown = (event: any) => {
		if (event.key === 'Enter') {
			handleNavigate()
		}
	}

	function handleClick() {
		handleNavigate()
	}

	function handleNavigate() {
		if (!id || !isValid) return
		router.push(`/${type === 'policy' ? 'policy' : 'protocol'}/${id}`)
	}

	return (
		<div className="flex gap-4">
			<Input
				type="search"
				placeholder="Enter a heimdall compliant protocol ..."
				className="md:w-[120px] lg:w-[420px] lg:h-[42px]"
				onChange={(e) => setId(e.target.value)}
				onKeyDown={handleKeyDown}
			/>

			<Button disabled={!id || !isValid} onClick={handleClick} className="lg:h-[42px]">
				Search
			</Button>
		</div>
	)
}
