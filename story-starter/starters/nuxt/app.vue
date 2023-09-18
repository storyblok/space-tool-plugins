<template>
    <div>
        <Hello></Hello>
    </div>
</template>

<script setup lang="ts">
import { XPTO, Hello } from 'common'
const a: number = XPTO

console.log(a)
</script>
