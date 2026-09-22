import { anonChecks } from "@/utils/config-anonymaze";


export const anonimazeData = (data, pazienteId, secret) => {
	let results = {};
	
	// Dynamically execute each check based on the configuration
	anonChecks.forEach(check => {
		console.log(check.name);
		// Evaluate the check
			results = check.func(data, ...check.params, pazienteId, secret);
		console.log(results);

	});
	return results;
};