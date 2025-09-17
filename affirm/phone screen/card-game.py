# 主题目（two players, 52 cards）

# 设定：52 张牌（1..52），洗牌后均分给两个玩家。

# 规则：每轮双方各自翻最上面的一张牌，比较大小，赢的人把两张牌都放到自己的得分堆里（相当于 +1 分）。

# 结束条件：直到两人都没牌了。

# 胜负判定：

# 得分多的赢。

# 如果得分相同，比较各自得分堆里最大的牌，最大者胜。

# 这一部分就是经典的 2 人 War 游戏的简化版。


import random
from collections import deque
from dataclasses import dataclass, field
from typing import List, Optional


# ---------- 工具 ----------
def make_shuffled_deck(m: int, seed: Optional[int] = None) -> List[int]:
    """生成 1..m 的洗牌结果"""
    deck = list(range(1, m + 1))
    rng = random.Random(seed)
    rng.shuffle(deck)
    return deck


# =========================================================
# 主题目：2 人、52 张（A、B），最终分数相同用最大获胜牌决胜
# =========================================================
@dataclass
class TwoPlayerGame:
    seed: Optional[int] = None
    names: tuple = ("A", "B")
    deck_size: int = 52

    # 运行时字段
    hands: dict = field(init=False)
    won_pile: dict = field(init=False)

    def __post_init__(self):
        deck = make_shuffled_deck(self.deck_size, self.seed)
        half = self.deck_size // 2  # 题面保证能均分
        self.hands = {
            self.names[0]: deque(deck[:half]),
            self.names[1]: deque(deck[half:]),
        }
        self.won_pile = {self.names[0]: [], self.names[1]: []}

    def play(self) -> str:
        a, b = self.names
        while self.hands[a] and self.hands[b]:
            ca = self.hands[a].popleft()
            cb = self.hands[b].popleft()
            if   ca > cb: self.won_pile[a].extend([ca, cb])  # 本轮 2 张都记到 A
            elif cb > ca: self.won_pile[b].extend([ca, cb])  # 本轮 2 张都记到 B
            else:
                # 回合平局的处理题面未定义；这里选择作废（不计分不入堆）
                pass

        # 计分：每张获胜牌 = 1 分
        score_a, score_b = len(self.won_pile[a]), len(self.won_pile[b])
        if score_a > score_b: return a
        if score_b > score_a: return b

        # 最终平分 → 用各自得分堆里的最大牌决胜（若都空或再相等 → TIE）
        max_a = max(self.won_pile[a]) if self.won_pile[a] else -1
        max_b = max(self.won_pile[b]) if self.won_pile[b] else -1
        if   max_a > max_b: return a
        elif max_b > max_a: return b
        return "TIE"





# Follow-up（N players, M cards）

# 输入：

# 玩家名字列表（长度 N），比如 ["Joe", "Jill", "Bob"]。

# 牌堆大小 M，牌面是 1..M。

# 发牌：

# 每人先平均发 ⌊M/N⌋ 张。

# 剩余的 M % N 张随机分给不同的玩家（每人至多多 1 张）。

# 规则：

# 各玩家依次翻最上面一张牌，比较大小。

# 这一轮最大的玩家得分 +1（平局要不要算分需提前约定，一般是“都不加分”）。

# 结束条件：所有牌翻完。

# 胜负判定：得分最高的玩家胜，如果有多人并列最高，tie-break 规则是比较他们各自得分堆里最大的牌。

# 输出：最终赢家的名字。


# =========================================================
# Follow-up：N 人、M 张；先均发，再把余牌随机分给不同玩家（每人至多多 1 张）
# 回合：每人打 1 张；唯一最大者赢下本轮所有牌；回合并列最大 → 作废
# 终局：最高分者胜；若多人并列 → 用其得分堆最大牌做最终 tie-break；若仍并列 → 返回所有并列者
# =========================================================
@dataclass
class NPlayerGame:
    player_names: List[str]          # e.g. ["Joe", "Jill", "Bob"]
    deck_size: int                   # M
    seed: Optional[int] = None

    hands: dict = field(init=False)
    won_pile: dict = field(init=False)
    rng: random.Random = field(init=False)

    def __post_init__(self):
        n = len(self.player_names)
        if n <= 0: raise ValueError("Need at least 1 player.")
        if self.deck_size < 0: raise ValueError("deck_size must be >= 0")
        self.rng = random.Random(self.seed)

        deck = make_shuffled_deck(self.deck_size, self.seed)
        q, r = divmod(self.deck_size, n)

        # 先均发 q 张（保持发牌顺序）
        self.hands = {name: deque() for name in self.player_names}
        idx = 0
        for _ in range(q):
            for name in self.player_names:
                self.hands[name].append(deck[idx]); idx += 1

        # 余下 r 张随机分给 r 个不同玩家（每人最多多 1 张）
        if r:
            receivers = self.player_names[:]  # 复制
            self.rng.shuffle(receivers)
            receivers = receivers[:r]
            for name in receivers:
                self.hands[name].append(deck[idx]); idx += 1

        self.won_pile = {name: [] for name in self.player_names}

    def _play_one_round(self):
        table = []  # (name, card)
        for name in self.player_names:
            # 若有人没牌则不再开新的一轮（由外层循环控制）
            table.append((name, self.hands[name].popleft()))

        max_card = max(card for _, card in table)
        winners = [name for name, card in table if card == max_card]
        if len(winners) == 1:
            w = winners[0]
            # 该轮赢家拿走桌面所有牌
            self.won_pile[w].extend(card for _, card in table)
        else:
            # 回合平局：作废（不计分不入堆）
            pass

    def play(self) -> List[str]:
        # 只要每个人都还有至少 1 张，才能继续一整轮
        while all(self.hands[name] for name in self.player_names):
            self._play_one_round()

        # 1) 最高分（按牌张数计分）
        scores = {name: len(self.won_pile[name]) for name in self.player_names}
        best = max(scores.values()) if scores else 0
        cand = [name for name, sc in scores.items() if sc == best]

        if len(cand) == 1:
            return cand

        # 2) 最终 tie-break：比较各自得分堆的最大牌
        max_cards = {name: (max(self.won_pile[name]) if self.won_pile[name] else -1) for name in cand}
        best_max = max(max_cards.values())
        cand2 = [name for name, v in max_cards.items() if v == best_max]

        # 仍并列则返回所有并列者（极少见：都没得分或最大牌相同）
        return cand2


# ------------------ 简单演示 ------------------
if __name__ == "__main__":
    # 主题目
    g2 = TwoPlayerGame(seed=42)  # 固定种子，便于复现
    print("2P winner:", g2.play())

    # Follow-up
    players = ["Joe", "Jill", "Bob"]
    gN = NPlayerGame(players, deck_size=17, seed=99)
    winners = gN.play()
    print("N-player winners:", winners)