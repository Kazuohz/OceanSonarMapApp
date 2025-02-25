import sys

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

if __name__ == "__main__":
    num = int(sys.argv[1]) # Takes number from command line argument
    print(factorial(num))
    sys.stdout.flush()