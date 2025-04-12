// Find Median From Data Stream
// The median is the middle value in a sorted list of integers. For lists of even length, there is no middle value, so the median is the mean of the two middle values.

// For example:

// For arr = [1,2,3], the median is 2.
// For arr = [1,2], the median is (1 + 2) / 2 = 1.5
// Implement the MedianFinder class:

// MedianFinder() initializes the MedianFinder object.
// void addNum(int num) adds the integer num from the data stream to the data structure.
// double findMedian() returns the median of all elements so far.
// Example 1:

// Input:
// ["MedianFinder", "addNum", "1", "findMedian", "addNum", "3" "findMedian", "addNum", "2", "findMedian"]

// Output:
// [null, null, 1.0, null, 2.0, null, 2.0]

// Explanation:
// MedianFinder medianFinder = new MedianFinder();
// medianFinder.addNum(1);    // arr = [1]
// medianFinder.findMedian(); // return 1.0
// medianFinder.addNum(3);    // arr = [1, 3]
// medianFinder.findMedian(); // return 2.0
// medianFinder.addNum(2);    // arr[1, 2, 3]
// medianFinder.findMedian(); // return 2.0
// Constraints:

// -100,000 <= num <= 100,000
// findMedian will only be called after adding at least one integer to the data structure.

class MedianFinder {
    constructor() {
        this.small = new PriorityQueue((a, b) => b - a); // Max heap for smaller half
        this.large = new PriorityQueue((a, b) => a - b); // Min heap for larger half
    }

    /**
     * @param {number} num
     */
    addNum(num) {
        if (this.large.isEmpty() || num > this.large.front()) {
            this.large.enqueue(num);
        } else {
            this.small.enqueue(num);
        }

        if (this.small.size() > this.large.size() + 1) {
            this.large.enqueue(this.small.dequeue());
        } else if (this.large.size() > this.small.size() + 1) {
            this.small.enqueue(this.large.dequeue());
        }
    }

    /**
     * @return {number}
     */
    findMedian() {
        if (this.small.size() > this.large.size()) {
            return this.small.front();
        } else if (this.large.size() > this.small.size()) {
            return this.large.front();
        } else {
            return (this.small.front() + this.large.front()) / 2.0;
        }
    }
}