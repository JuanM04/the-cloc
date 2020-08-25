from time import sleep
import board
import neopixel

# auto_write=False doesn't do any changes until you run pixels.show()
pixels = neopixel.NeoPixel(
    pin=board.D12, n=60, brightness=0, auto_write=False, pixel_order=neopixel.GRB
)

hz = 100
max_brightness = 0.2

# All times are in seconds
def show_music(fade: int, color: (int, int, int)):
    pixels.brightness = 0
    pixels.fill(color)
    pixels.show()

    total_iter = round(fade * hz)

    for i in range(total_iter):
        pixels.brightness = max_brightness * pow(total_iter, -2) * pow(i, 2)
        pixels.show()
        sleep(1 / hz)


def hide_music(fade: int):
    total_iter = round(fade * hz)

    for i in reversed(range(total_iter)):
        pixels.brightness = max_brightness * pow(total_iter, -2) * pow(i, 2)
        pixels.show()
        sleep(1 / hz)

    pixels.brightness = 0
    pixels.show()
