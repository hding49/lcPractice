# Sum of Islands Max

# (This question is a variation of the LeetCode question Number of Islands. If you haven't completed that question yet, it is recommended to solve it first.)

# You are given a m × n 2D grid where each cell contains either a positive integer or 0. A cell with a positive integer represents part of an island, while a cell with 0 is water. An island is a group of connected cells (horizontally or vertically). Each island is separated by water.

# Find the sum of the largest numbers from each island.

# Constraints:

# 1 <= m, n <= 300
# Each cell in the grid contains an integer between 0 and 
# 10
# 4
# 10 
# 4
 
# Example 1:

# Input:
#  grid =
#  [
#   [0,2,0,0],
#   [3,4,0,5],
#   [0,0,0,6],
#   [7,0,8,0]
# ]
# Output: 25
# Explanation: The sum of the largest numbers is 4 + 6 + 7 + 8 = 25, because
# For island [2,4,3], max = 4
# For island [5,6], max = 6
# For island [7], max = 7
# For island [8], max = 8

# Example 2:

# Input: grid = [[[1,0,2],[0,3,0],[4,0,5]]]
# Output: 15

# Example 3:

# Input: grid = [[0,0,0],[0,0,0],[0,0,0]]
# Output: 0



from collections import deque
from typing import List

def sum_of_islands_max(grid: List[List[int]]) -> int:
    """
    Return the sum of the maximum value from each island in the grid.
    An island is 4-connected (up/down/left/right) and consists of cells > 0.

    Args:
        grid: m x n list of lists with non-negative integers

    Returns:
        Sum of per-island maxima
    """
    if not grid or not grid[0]:
        return 0

    m, n = len(grid), len(grid[0])
    visited = [[False] * n for _ in range(m)]
    ans = 0

    def bfs(sr: int, sc: int) -> int:
        """BFS the island starting at (sr, sc), return the island's max value."""
        q = deque([(sr, sc)])
        visited[sr][sc] = True
        island_max = grid[sr][sc]
        while q:
            r, c = q.popleft()
            val = grid[r][c]
            if val > island_max:
                island_max = val
            # 4 neighbors
            if r > 0 and grid[r-1][c] > 0 and not visited[r-1][c]:
                visited[r-1][c] = True
                q.append((r-1, c))
            if r+1 < m and grid[r+1][c] > 0 and not visited[r+1][c]:
                visited[r+1][c] = True
                q.append((r+1, c))
            if c > 0 and grid[r][c-1] > 0 and not visited[r][c-1]:
                visited[r][c-1] = True
                q.append((r, c-1))
            if c+1 < n and grid[r][c+1] > 0 and not visited[r][c+1]:
                visited[r][c+1] = True
                q.append((r, c+1))
        return island_max

    for i in range(m):
        for j in range(n):
            if grid[i][j] > 0 and not visited[i][j]:
                ans += bfs(i, j)

    return ans


# ---- Quick tests ----
if __name__ == "__main__":
    grid1 = [
        [0,2,0,0],
        [3,4,0,5],
        [0,0,0,6],
        [7,0,8,0]
    ]
    print(sum_of_islands_max(grid1))  # Expected: 25 (4 + 6 + 7 + 8)

    # Example 2 (按题意应为 3x3 网格；原示例多了层方括号)
    grid2 = [
        [1,0,2],
        [0,3,0],
        [4,0,5]
    ]
    # 六个独立岛屿的最大值分别是 1,2,3,4,5 → 总和 15
    print(sum_of_islands_max(grid2))  # Expected: 15

    grid3 = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]
    print(sum_of_islands_max(grid3))  # Expected: 0

