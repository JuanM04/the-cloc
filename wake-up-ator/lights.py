from time import sleep
import math
import board
import neopixel

# auto_write=False doesn't do any changes until you run pixels.show()
pixels = neopixel.NeoPixel(
    pin=board.D12, n=30, brightness=0, auto_write=False, pixel_order=neopixel.GRB
)

hz = 100
max_brightness = 0.2

# All times are in seconds
def fade_in(fade: int, color: (int, int, int)):
    pixels.brightness = 0
    pixels.fill(color)
    pixels.show()

    total_iter = round(fade * hz)

    for i in range(total_iter):
        pixels.brightness = max_brightness * pow(total_iter, -2) * pow(i, 2)
        pixels.show()
        sleep(1 / hz)


def fade_out(fade: int):
    total_iter = round(fade * hz)

    for i in reversed(range(total_iter)):
        pixels.brightness = max_brightness * pow(total_iter, -2) * pow(i, 2)
        pixels.show()
        sleep(1 / hz)

    pixels.brightness = 0
    pixels.show()


def bedtime():
    color = (255, 255, 255)
    for _ in range(3):
        fade_in(0.5, color)
        fade_out(0.5)
        sleep(0.5)


def meantime(now: float, bedtime: float, wakeup: float):
    #
    # 0 1       5     8   10
    #   B       G     Y   R

    #
    # total = wakeup - bedtime
    # now = now - bedtime
    #
    # total * x = 10; now * x = y
    # => x = 10 / total
    # y = now * (10 / total)
    #
    total = 10
    now = (now - bedtime) * (total / (wakeup - bedtime))

    if now < 1:
        pixels.brightness = 0
    else:
        pixels.brightness = max_brightness

    if 1 <= now <= 5:
        pixels.fill(
            (0, math.floor(255 * (now - 1) / 4), math.floor(255 * (5 - now) / 4))
        )
    elif 5 < now <= 8:
        pixels.fill((math.floor(255 * (now - 5) / 3), 255, 0))
    elif 8 < now < 10:
        pixels.fill((255, math.floor(255 * (10 - now) / 2), 0))

    pixels.show()
