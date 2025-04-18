import puppeteer, { Page, Browser } from 'puppeteer';
import crypto from 'crypto';
import http from 'http';
import handler  from 'serve-handler';
import path from 'path';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { setupScreenshotTesting } from './screenshotUtils/screenshotTesting';
import { BROWSER_OPTIONS } from './screenshotUtils/browserOptions';

let server: any;
let browser: Browser;
let page: Page;

const SNAPSHOT_DIR = path.join(__dirname, '__image_snapshots__');

const MATCH_SNAPSHOT_OPTIONS: MatchImageSnapshotOptions = { customSnapshotsDir: SNAPSHOT_DIR, failureThreshold: 0.05, failureThresholdType: 'percent', customSnapshotIdentifier: ({ currentTestName }) => {
  const result = currentTestName.replace(/^Screenshot\s/, '').replaceAll(' ', '_').replaceAll('/', '-');

  if (result.length > 150) {
    return crypto.createHash('md5').update(result).digest('hex');
  }

  return result;

}}

const screenshotTesting = setupScreenshotTesting({
  it,
  expect,
  matchOptions: MATCH_SNAPSHOT_OPTIONS,
  getPage: () => page,
})

describe('Screenshot', () => {
  beforeAll(async () => {
    server = http.createServer((req, res) => {
      return handler(req, res, {
        public: path.join(__dirname, '..', '..', 'storybook-static'),
      });
    });

    server.listen(6006);
    browser = await puppeteer.launch(BROWSER_OPTIONS);
    page = await browser.newPage();
  }, 30000)



  screenshotTesting({
    componentName: 'multidropdown',
    props: {
      'value[0].key': ['msk'],
      'value[1].key': ['spb'],
      'value[0].value': ['Moscow'],
      'value[1].value': ['Saint Petersburg'],
      disabled: [true, false, undefined],
      className: ['test-multidropdown'],
    },
    viewPort: {
      width: 400,
      height: 200,
    },
  });

  screenshotTesting({
    name: 'multidropdown click',
    componentName: 'multidropdown',
    props: {
      'value[0].key': ['msk'],
      'value[1].key': ['spb'],
      'value[0].value': ['Moscow'],
      'value[1].value': ['Saint Petersburg'],
      disabled: [true, false, undefined],
      className: ['test-multidropdown'],
    },
    viewPort: {
      width: 400,
      height: 600,
    },
    evaluate: async (p: Page) => {
      await p.click('.test-multidropdown')
    },
  });

  screenshotTesting({
    componentName: 'checkbox',
    props: {
      disabled: [true, false, undefined],
      checked: [true, false, undefined],
      className: ['test-checkbox'],
    },
    viewPort: {
      width: 100,
      height: 100,
    },
    matchOptions: {
      blur: 2,
      failureThreshold: 0.02,
    }
  });

  screenshotTesting({
    name: 'checkbox hover',
    componentName: 'checkbox',
    props: {
      disabled: [true, false, undefined],
      checked: [true, false, undefined],
      className: ['test-checkbox'],
    },
    viewPort: {
      width: 100,
      height: 100,
    },
    evaluate: async (p: Page) => {
      await p.hover('.test-checkbox');
      await p.waitForTimeout(300);
    },
    matchOptions: {
      blur: 2,
      failureThreshold: 0.02,
    }
  });

  screenshotTesting({
    name: 'checkbox click',
    componentName: 'checkbox',
    props: {
      disabled: [true, false, undefined],
      className: ['test-checkbox'],
    },
    viewPort: {
      width: 100,
      height: 100,
    },
    evaluate: async (p: Page) => {
      await p.click('.test-checkbox');
      await p.waitForTimeout(300);
      await p.mouse.move(100, 100);
    },
    matchOptions: {
      blur: 2,
      failureThreshold: 0.02,
    }
  });

  afterAll((done) => {
    browser.close();
    server.close(done);
  }, 30000)
});
