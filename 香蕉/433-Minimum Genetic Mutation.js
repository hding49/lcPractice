// 433. Minimum Genetic Mutation
// Medium
// Topics
// Companies
// A gene string can be represented by an 8-character long string, with choices from 'A', 'C', 'G', and 'T'.

// Suppose we need to investigate a mutation from a gene string startGene to a gene string endGene where one mutation is defined as one single character changed in the gene string.

// For example, "AACCGGTT" --> "AACCGGTA" is one mutation.
// There is also a gene bank bank that records all the valid gene mutations. A gene must be in bank to make it a valid gene string.

// Given the two gene strings startGene and endGene and the gene bank bank, return the minimum number of mutations needed to mutate from startGene to endGene. If there is no such a mutation, return -1.

// Note that the starting point is assumed to be valid, so it might not be included in the bank.

 

// Example 1:

// Input: startGene = "AACCGGTT", endGene = "AACCGGTA", bank = ["AACCGGTA"]
// Output: 1
// Example 2:

// Input: startGene = "AACCGGTT", endGene = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]
// Output: 2
 

// Constraints:

// 0 <= bank.length <= 10
// startGene.length == endGene.length == bank[i].length == 8
// startGene, endGene, and bank[i] consist of only the characters ['A', 'C', 'G', 'T'].


// Time complexity: O(B), where B = bank.length.
// Space complexity: O(1)

var minMutation = function(start, end, bank) {
	const choices = ['A', 'C', 'G', 'T'];
	const queue = [start];
	const seen = new Set([start]);

	let steps = 0;

	while (queue.length !== 0) {
		const nodesInQueue = queue.length;

		for (let j = 0; j < nodesInQueue; j++) {
			const node = queue.shift();

			if (node === end)
				return steps;

			for (const choice of choices) {
				for (let i = 0; i < node.length; i++) {
					const neighbor = node.substring(0, i) + choice + node.substring(i + 1);

					if (!seen.has(neighbor) && bank.includes(neighbor)) {
						queue.push(neighbor);
						seen.add(neighbor);
					}
				}
			}
		}

		steps++;
	}

	return -1;
}