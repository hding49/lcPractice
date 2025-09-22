# 滑动窗口乘积维护，左指针尽量右移以保持 < k。

def numSubarrayProductLessThanK(nums, k):
    if k <= 1:
        return 0
    prod, left, ans = 1, 0, 0
    for right, x in enumerate(nums):
        prod *= x
        while prod >= k:
            prod //= nums[left]
            left += 1
        ans += right - left + 1
    return ans


# 复杂度：时间 O(n)，空间 O(1)。