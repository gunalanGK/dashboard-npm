import { ObjectKeyGeneric } from '@/types/common';

type Cloneable = Record<string, any> | Array<any> | any;

type AnyFunction = (...args: any[]) => any;

export const CustomStartCase = (data: string) => {
	return data
		?.toLowerCase()
		.split(/[\s\-_]+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const CustomUpperFirst = (data: string) =>
	data && data?.charAt(0).toUpperCase() + data?.slice(1);

export const CustomSnakeCase = (data: string) =>
	data
		?.replace(/\W+/g, '_')
		?.replace(/([a-z\d])([A-Z])/g, '$1_$2')
		?.toLowerCase();

export const CustomGet = (obj: any, path: string, defaultValue: any = undefined) => {
	const keys = path.split('.');
	let current = obj;
	for (const key of keys) {
		if (current && typeof current === 'object' && key in current) {
			current = current[key];
		} else {
			return defaultValue;
		}
	}

	return current;
};

export const CustomCloneDeep = (data: Cloneable) => {
	if (!data) return;
	return JSON.parse(JSON.stringify(data));
};

export const CustomPick = (obj: { [x: string]: any }, keys: string | any[]) => {
	if (typeof keys === 'string') {
		keys = [keys];
	}
	return keys.reduce((acc, key) => {
		if (obj[key]) {
			acc[key] = obj[key];
		}
		return acc;
	}, {});
};

export const CustomStartWord = (data: string) => {
	return data
		?.replace(/([a-z])([A-Z])/g, '$1 $2')
		?.replace(/\b\w/g, (match) => match.toUpperCase())
		?.replace(/_/g, ' ');
};

export const CustomCamelCase = (str: string) => {
	return str?.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase()); // Convert to camelCase
};

export const CustomIsEmpty = (value: any) => {
	// Check if the value is null or undefined
	if (value == null) {
		return true;
	}

	// Check if the value is an empty string, array, or object
	if (typeof value === 'string' || Array.isArray(value)) {
		return value.length === 0;
	}

	// Check if the value is an empty object (no own properties)
	if (typeof value === 'object') {
		return Object.keys(value).length === 0;
	}

	// For other types, consider them as non-empty
	return false;
};

export const CustomIsString = (value: Cloneable) => {
	return typeof value === 'string' || value instanceof String;
};

export const CustomIsEqual = (value1: Cloneable, value2: Cloneable) => {
	// Handle primitive types and dates
	if (value1 === value2) {
		return true;
	}

	// Check if both values are objects
	if (typeof value1 === 'object' && typeof value2 === 'object') {
		// Check if the number of keys is the same
		const keys1 = Object.keys(value1);
		const keys2 = Object.keys(value2);
		if (keys1.length !== keys2.length) {
			return false;
		}

		// Check each key-value pair recursively
		for (const key of keys1) {
			if (!CustomIsEqual(value1[key], value2[key])) {
				return false;
			}
		}

		return true;
	}

	// If values are not objects or primitives, they are not equal
	return false;
};

export const CustomIncludes = (collection: Cloneable, value: Cloneable) => {
	// Handle arrays
	if (Array.isArray(collection)) {
		return collection.indexOf(value) !== -1;
	}

	// Handle strings
	if (typeof collection === 'string') {
		return (collection as string).includes(value as unknown as string);
	}

	// Handle other types
	return false;
};

export const CustomTruncate = (str: Cloneable, maxLength: number, suffix = '...') => {
	if (typeof str !== 'string' || (str as string).length <= maxLength) {
		return str;
	}

	return (str as string).slice(0, maxLength - suffix.length) + suffix;
};

export const CustomDebounce = <T extends AnyFunction>(func: T, delay: number) => {
	let timeoutId: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
};

export function CustomFind<T>(collection: T[], predicate: (item: T) => boolean): T | undefined {
	for (const item of collection) {
		if (predicate(item)) {
			return item;
		}
	}
	return undefined;
}

export const CustomEndsWith = (str: string, suffix: string): boolean => {
	return str.endsWith(suffix);
};

export const CustomIsNil = (value: Cloneable) => {
	return value === null || value === undefined;
};

export const CustomOmit = (obj: ObjectKeyGeneric, keysToOmit: Array<string>) => {
	const newObj: ObjectKeyGeneric = {};
	for (const key in obj) {
		if (!keysToOmit.includes(key)) {
			newObj[key] = obj[key];
		}
	}
	return newObj;
};
