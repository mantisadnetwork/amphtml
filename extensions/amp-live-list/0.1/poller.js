/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {exponentialBackoffClock, getJitter,}
    from '../../../src/exponential-backoff';
import {timer} from '../../../src/timer';


/**
 * Poller with backoff functionality.
 */
export class Poller {

  constructor(win, wait, work) {
    /** @private @const {!Window} */
    this.win = win;

    /** @private {number} */
    this.wait_ = wait;

    /** @private {function(): !Promise} */
    this.work_ = work;

    /** @private {?number} */
    this.lastTimeoutId_ = null;

    /** @private {boolean} */
    this.isRunning_ = false;

    /** @private {?function(): number} */
    this.backoffClock_ = null;

    /**
     * Mostly for testing purposes.
     * @private {!Promise}
     */
    this.lastWorkPromise_ = null;
  }

  /**
   * Get the required interval value to be used for timeout.
   * @return {number}
   * @private
   */
  getTimeout_() {
    if (this.backoffClock_) {
      return this.backoffClock_();
    }
    return this.wait_ + getJitter(this.wait_, 0.2);
  }

  /**
   * @return {boolean}
   */
  isRunning() {
    return this.isRunning_;
  }

  /**
   * Initalize any work needed to start polling.
   */
  start() {
    if (this.isRunning_) {
      return;
    }

    this.isRunning_ = true;
    this.poll_();
  }

  /**
   * Clear timers and set correct stop state.
   */
  stop() {
    if (!this.isRunning_) {
      return;
    }

    this.isRunning_ = false;
    this.clear_();
  }

  /**
   * Cancels the last queued timeout.
   */
  clear_() {
    if (this.lastTimeoutId_) {
      timer.cancel(this.lastTimeoutId_);
      this.lastTimeoutId_ = null;
    }
  }

  /**
   * Queues a timeout that executes the work and recursively calls
   * itself on success.
   * @private
   */
  poll_() {
    if (!this.isRunning_) {
      return;
    }

    this.lastTimeoutId_ = timer.delay(() => {
      this.lastWorkPromise_ = this.work_()
          .then(() => {
            if (this.backoffClock_) {
              this.backoffClock_ = null;
            }
            this.poll_();
          }).catch(err => {
            if (err.retriable) {
              if (!this.backoffClock_) {
                this.backoffClock_ = exponentialBackoffClock();
              }
              this.poll_();
            } else {
              throw err;
            }
          });
    }, this.getTimeout_());
  }
}
