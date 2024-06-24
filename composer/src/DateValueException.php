<?php declare(strict_types=1);
namespace NagatomoO\JapaneseStyle;

use Exception;
use Throwable;

/**
 * 漢数字
 */
class DateValueException extends Exception {
    function __construct(string $message = "", int $code = 0, Throwable $previous = null) {
        parent::__construct($message, $code, $previous);
    }
}

