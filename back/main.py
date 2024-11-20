import schedule
import time
import pandas as pd
from datetime import datetime, timedelta
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

if __name__ == "__main__":
    logging.info("Starting the scheduler")