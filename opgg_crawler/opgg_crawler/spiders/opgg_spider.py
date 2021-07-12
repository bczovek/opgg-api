import scrapy
import time
from scrapy_selenium import SeleniumRequest
from scrapy.http import TextResponse 
import redis
import yaml

class TestSpider(scrapy.Spider):
    name = "elise"

    def __init__(self):

        with open("databaseconfig.yml", "r") as cfgfile:
            cfg = yaml.load(cfgfile, Loader=yaml.CLoader)

        self.r = redis.Redis(host=cfg["host"], port=cfg["port"], db=0, decode_responses=True)

    def start_requests(self):
        yield SeleniumRequest(url = "https://euw.op.gg/statistics/champion/", callback=self.parse_result)

    def parse_result(self, response):
        driver = response.request.meta['driver']
        time.sleep(5)
        driver.find_element_by_css_selector('.css-1litn2c').click()
        time.sleep(2)
        divisions = ['all','iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'challenger']
        for div in divisions:
            driver.find_element_by_css_selector('#tier_'+div+' > label:nth-child(2)').click()
            time.sleep(10)
            resp = TextResponse(url=driver.current_url, body=driver.page_source, encoding='utf-8')
            time.sleep(5)
            for row in resp.css('.StatisticsChampionTable > tbody:nth-child(3)').css('tr.Row'):
                name = row.css('.ChampionName a::text').get().replace(" ", "").replace("'", "").lower();
                self.r.hmset('stats_euw_'+div+'_'+name,
                            {'name': name,
                    'winrate': row.css('[data-value] span.Value::text').get(),
                    'games': row.css('td:nth-child(5)::text').get().strip(),
                    'kda': row.css('span.Ratio::text').get(),
                    'cs': row.css('span.Green::text').get(),
                    'gold': row.css('span.Orange::text').get(),})
                self.r.sadd('stats_euw_'+div+'_all', 'stats_euw_'+div+'_'+name)
                